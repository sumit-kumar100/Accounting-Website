import NextLink from 'next/link'
import DehazeIcon from '@mui/icons-material/Dehaze'
import AddIcon from '@mui/icons-material/Add'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import axios from 'axios'
import User from './userProfile'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Box, Stack, AppBar, Toolbar, IconButton, Button, Drawer, useMediaQuery, ListItem, Tooltip, Modal } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { useRouter } from 'next/router'

const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 92

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
        paddingLeft: 280
    }
}))

const RootStyle = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
    },
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
    minHeight: APPBAR_MOBILE,
    [theme.breakpoints.up('lg')]: {
        minHeight: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5),
    },
}))

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    border: 'none',
    borderRadius: 7.5,
    outline: 'none',
    width: '70%',
    paddingLeft: 20,
    paddingRight: 20
}


const items = [
    {
        href: '/entry-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Entry Book'
    },
    {
        href: '/purchase-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Purchases Book'
    },
    {
        href: '/sale-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Sales , Balances & Losses Book'
    },
    {
        href: '/purchase-ledger',
        icon: (<AddIcon fontSize="small" />),
        title: 'Purchases Ledger'
    },
    {
        href: '/sale-ledger',
        icon: (<AddIcon fontSize="small" />),
        title: 'Sales , Balances & Losses Ledger'
    },
    {
        href: '/cash-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Cash Book'
    },
    {
        href: '/vendor-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Vendors'
    },
    {
        href: '/customer-book',
        icon: (<AddIcon fontSize="small" />),
        title: 'Customers'
    }
]

const AdminDashboardLayout = ({ children }) => {

    const Notes = dynamic(() => import('./notes'))

    const router = useRouter()

    const [isSidebarOpen, setSidebarOpen] = useState(false)

    const [showNote, setShowNote] = useState(false)

    const handleLogout = async () => {
        await axios.post('api/auth/logout-user')
        router.replace('/login')
    }

    return (
        <>
            <DashboardLayoutRoot>
                <Box sx={{ marginTop: { xs: 1, md: 4 }, width: '50%', display: 'flex', flex: '1 1 auto', flexDirection: 'column', }}>
                    {children}
                </Box>
            </DashboardLayoutRoot>
            <Modal open={showNote} onClose={() => setShowNote(false)}>
                <Box style={{ ...style, width: '90%', overflow: 'auto', height: '80%' }}>
                    <Notes setShow={() => setShowNote(false)} />
                </Box>
            </Modal>
            <RootStyle>
                <ToolbarStyle>
                    <IconButton onClick={() => setSidebarOpen(!isSidebarOpen)} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
                        <DehazeIcon />
                    </IconButton>
                    <Tooltip title="Add Notes" >
                        <IconButton onClick={() => setShowNote(!showNote)}>
                            <NoteAddIcon />
                        </IconButton>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                        <Button variant="outlined" size="small" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Stack>
                </ToolbarStyle>
            </RootStyle>
            {!useMediaQuery('(max-width:1200px)') ? (
                <Drawer anchor="left" open PaperProps={{ sx: { backgroundColor: 'neutral.900', color: '#FFFFFF', width: 280, display: { xs: 'none', lg: 'block' } } }} variant="permanent">
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <User />
                        <ul>
                            {items.map((item, index) => (
                                <ListItem key={index} disableGutters sx={{ display: 'flex', mb: 0.5, py: 0, px: 1 }}>
                                    <NextLink href={item.href} passHref>
                                        <Button
                                            onClick={() => setSidebarOpen(false)}
                                            component="a"
                                            startIcon={item.icon}
                                            disableRipple
                                            sx={{
                                                backgroundColor: router.pathname === item.href && 'rgba(255,255,255, 0.08)',
                                                borderRadius: 1,
                                                color: router.pathname === item.href ? 'secondary.main' : 'neutral.300',
                                                fontWeight: router.pathname === item.href && 'fontWeightBold',
                                                justifyContent: 'flex-start',
                                                px: 3,
                                                textAlign: 'left',
                                                textTransform: 'none',
                                                width: '100%',
                                                '& .MuiButton-startIcon': {
                                                    color: router.pathname === item.href ? 'secondary.main' : 'neutral.400'
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255, 0.08)'
                                                }
                                            }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                {item.title}
                                            </Box>
                                        </Button>
                                    </NextLink>
                                </ListItem>
                            ))}
                        </ul>
                    </Box>
                </Drawer>

            ) : (
                <Drawer anchor="left" onClose={() => setSidebarOpen(false)} open={isSidebarOpen} PaperProps={{ sx: { backgroundColor: 'neutral.900', color: '#FFFFFF', width: 280, display: { xs: 'block', lg: 'none' } } }} sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }} variant="temporary">
                    <User />
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <ul>
                            {items.map((item, index) => (
                                <ListItem key={index}>
                                    <NextLink href={item.href} passHref>
                                        <Button
                                            onClick={() => setSidebarOpen(false)}
                                            component="a"
                                            startIcon={item.icon}
                                            disableRipple
                                            sx={{
                                                backgroundColor: router.pathname === item.href && 'rgba(255,255,255, 0.08)',
                                                borderRadius: 1,
                                                color: router.pathname === item.href ? 'secondary.main' : 'neutral.300',
                                                fontWeight: router.pathname === item.href && 'fontWeightBold',
                                                justifyContent: 'flex-start',
                                                px: 3,
                                                textAlign: 'left',
                                                textTransform: 'none',
                                                width: '100%',
                                                '& .MuiButton-startIcon': {
                                                    color: router.pathname === item.href ? 'secondary.main' : 'neutral.400'
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255, 0.08)'
                                                }
                                            }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                {item.title}
                                            </Box>
                                        </Button>
                                    </NextLink>
                                </ListItem>
                            ))}
                        </ul>
                    </Box>
                </Drawer >
            )}
        </>
    )
}

export default AdminDashboardLayout