import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const DataTable = ({ columns, data, size }) => (
    <TableContainer component={Paper}>
        <Table aria-label="simple table" size={size ? size : "small"}>
            <TableHead sx={{ height: '50px' }}>
                <TableRow>
                    {columns?.map((row, index) => (
                        <TableCell
                            key={index}
                            align={row?.center ? "center" : row?.right ? "right" : "left"}
                            width={row?.width ? row.width : "auto"}
                        >
                            {row?.name}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data?.map((item, i) => (
                    <TableRow key={i} >
                        {columns?.map((row, j) => (
                            <TableCell
                                key={j}
                                sx={{
                                    borderBottomStyle: 'solid',
                                    borderBottomWidth: '0.85px',
                                    borderBottomColor: 'rgba(0,0,0,.12)'
                                }}
                                align={row?.center ? "center" : row?.right ? "right" : "left"}
                                width={row?.width ? row.width : "auto"}
                            >
                                {row.cell(item, i)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer >
)


export default DataTable
