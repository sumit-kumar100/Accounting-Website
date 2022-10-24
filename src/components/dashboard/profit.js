import CloseIcon from '@mui/icons-material/Close'
import dynamic from 'next/dynamic'
import { useState } from 'react';
import { Suspense } from 'react'
import { Modal, Box, IconButton, Tabs, Tab, Skeleton } from "@mui/material"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: '95%',
    height: { xs: '80%', md: '95%' },
    borderRadius: '10px',
    boxShadow: 24,
    paddingLeft: { xs: 1, md: 3 },
    paddingRight: { xs: 1, md: 3 },
    paddingBottom: 3
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}


const Profit = ({ show, setShow }) => {

    const [tab, setTab] = useState(0);

    const Yearly = dynamic(() => import('./profit/yearly'), { suspense: true })

    const Monthly = dynamic(() => import('./profit/monthly'), { suspense: true })

    return (
        <Modal
            open={show}
            onClose={setShow}
        >
            <Box sx={style}>
                <IconButton onClick={setShow} sx={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer', zIndex: 999 }} >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '5px' }}>
                    <Tabs value={tab} onChange={(e, value) => setTab(value)}>
                        <Tab label="MONTHLY" />
                        <Tab label="YEARLY" />
                    </Tabs>
                </Box>
                <TabPanel value={tab} index={0}>
                    <Suspense fallback={
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Skeleton variant='rectangular' animation='wave' width={'20%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'40%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'50%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'60%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'70%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'80%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'90%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'100%'} height={20} />
                        </Box>
                    }>
                        <Monthly />
                    </Suspense>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <Suspense fallback={
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Skeleton variant='rectangular' animation='wave' width={'20%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'40%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'50%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'60%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'70%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'80%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'90%'} height={20} />
                            <Skeleton variant='rectangular' animation='wave' width={'100%'} height={20} />
                        </Box>
                    }>
                        <Yearly />
                    </Suspense>
                </TabPanel>
            </Box>
        </Modal>
    )
}


export default Profit