import axios from 'axios'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import { MonthlyProfitData } from '../../../utils/avail'
import { startOfMonth, endOfMonth } from 'date-fns'
import { TextField, Box, InputAdornment, Button, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}

const Monthly = () => {

    const [windowSize, setWindowSize] = useState(getWindowSize());

    const [date, setDate] = useState(new Date())

    const [profit, setProfit] = useState(null)

    const calculateProfit = async () => {

        const [expenses, income] = await axios.all([
            axios.post('/api/entry/list',
                {
                    aggregate: true,
                    query: "fetchMonthlyExpenses",
                    startDate: date,
                    endDate: date
                }
            ),
            axios.post('/api/entry/list',
                {
                    aggregate: true,
                    query: "fetchMonthlyIncome",
                    startDate: date,
                    endDate: date
                }
            ),
        ])
        const expensesData = expenses?.data?.data.reduce((prev, curr) => {
            prev[String(new Date(curr?._id).getDate())] = curr.data.reduce((sum, row) => sum + row.total + row.charges, 0)
            return prev
        }, {})

        const incomeData = income?.data?.data.reduce((prev, curr) => {
            prev[String(new Date(curr?._id).getDate())] = curr.data.reduce((sum, row) => sum + row.total + row.charges, 0)
            return prev
        }, {})

        setProfit(MonthlyProfitData(incomeData, expensesData, date))
    }

    const labels = Object.keys(profit ? profit : [])

    const options = {
        plugins: {
            title: {
                display: true,
                text: `Profits for - ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
            },
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: `Profit (₹) `,
                data: profit ? profit : [],
                backgroundColor: '#0047AB',
            }
        ]
    }

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    useEffect(() => {
        calculateProfit()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date])

    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            views={['year', 'month']}
                            value={date}
                            disableFuture={true}
                            onChange={date => setDate(date)}
                            closeOnSelect
                            showDaysOutsideCurrentMonth={false}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InsertInvitationIcon fontSize='small' />
                                    </InputAdornment>
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    sx={{ width: '135px' }}
                                    className='my-date-picker'
                                    size='small'
                                    required
                                    {...params}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>
                <Button color="error">{`Total Profit : ₹${profit ? parseInt(Object.keys(profit).reduce((sum, row) => sum + profit[row], 0)) : 0}`}</Button>
            </Box>
            <Box mt={2} >
                <Bar options={options} data={data} height={windowSize.innerWidth >= 768 ? 100 : windowSize.innerWidth > 448 ? 145 : 270} />
                <Typography fontSize={12} fontWeight="bold" color="#5E6166" textAlign="center" marginTop={1}>{Object.keys(profit || []).length ? "Days" : ""}</Typography>
            </Box>
        </Box>
    )
}


export default Monthly