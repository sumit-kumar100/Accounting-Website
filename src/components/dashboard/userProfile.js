import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import * as yup from 'yup'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { userActions } from '../../redux/user'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"
import { Box, Badge, IconButton, Modal, Button, TextField, Tooltip, Container, FormHelperText, InputAdornment, FormControl, OutlinedInput, InputLabel, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { styled } from '@mui/material/styles'


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: { xs: '80%', md: '40%' },
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
    paddingTop: 5,
    paddingBottom: 5
}

const defaultValues = {
    name: "",
    mobile: ""
}

const User = () => {

    const Profit = dynamic(() => import('./profit'))

    const dispatch = useDispatch()

    const { user } = useSelector(state => state.user)

    const validateSchema = {
        name: yup.string().required('Name is required'),
        mobile: yup.string().required('Mobile no. is required')
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(yup.object().shape(validateSchema)) })

    const [modal, setModal] = useState(false)

    const [showOtpForm, setShowOtpForm] = useState(false)

    const [formError, setFormError] = useState(null)

    const [otp, setOtp] = useState("")

    const [otpError, setOtpError] = useState(null)

    const [requestID, setRequestID] = useState("")

    const [userData, setUserData] = useState(null)

    const [profitModal, setProfitModal] = useState(false)

    const onSubmit = async (data, e) => {
        e?.preventDefault()
        if (data.mobile === user.mobile) {
            const response = await axios.put('/api/auth-user/update-profile', { name: data.name, nameOnly: true })
            if (response?.data?.status) {
                dispatch(userActions.setUser(response.data.data))
                setModal(false)
                toast.success("Profile Updated Successfully")
                return
            }
        }
        const response = await axios.post('/api/auth/send-otp/', { mobile: data.mobile })
        if (response?.data?.status) {
            setRequestID(response?.data?.data?.requestID)
            setShowOtpForm(true)
            setUserData(data)
            setFormError(null)
            reset({ ...defaultValues })
        }
        setFormError(response?.data?.error)
    }

    const handleOTPSubmit = async e => {
        e?.preventDefault()
        const response = await axios.put('/api/auth-user/update-profile', { userData, requestID, otp, nameOnly: false })
        if (response?.data?.status) {
            dispatch(userActions.setUser(response.data.data))
            setOtpError(null)
            setModal(false)
            setOtp("")
            setShowOtpForm(false)
            toast.success("Profile Updated Successfully")
        }
        setOtpError(response?.data?.error)
    }

    return (
        <>
            <Modal
                open={modal}
                onClose={() => setModal(!modal)}
            >
                <Box sx={style}>
                    {!showOtpForm ? (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                            <Container>
                                <Controller
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.name ? true : false}
                                            helperText={errors.name ? errors.name.message : ""}
                                            fullWidth
                                            label='Enter Full Name'
                                            {...field}
                                        />
                                    )}
                                    name='name'
                                    control={control}
                                />
                                <Controller
                                    render={({ field }) => (
                                        <TextField
                                            sx={{ mb: 2, mt: 3 }}
                                            error={errors.mobile ? true : false}
                                            helperText={errors.mobile ? errors.mobile.message : ""}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">+91</InputAdornment>
                                            }}
                                            label='Enter Mobile'
                                            {...field}
                                        />
                                    )}
                                    name='mobile'
                                    control={control}
                                />
                                {formError ? (<FormHelperText error sx={{ marginBottom: 2, marginLeft: 2 }}>
                                    {formError}
                                </FormHelperText>) : null}
                                <Button type='submit' color='primary' variant="contained" fullWidth>UPDATE PROFILE</Button>
                            </Container>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit}>
                            <Container>
                                <FormControl sx={{ mt: 2, mb: 2 }} variant="outlined" fullWidth>
                                    <InputLabel>Enter OTP</InputLabel>
                                    <OutlinedInput
                                        type="number"
                                        value={otp}
                                        required
                                        onChange={e => setOtp(e.target.value)}
                                        label="Enter OTP"
                                    />
                                    <FormHelperText sx={otpError ? { marginTop: 2, fontWeight: 'bold', letterSpacing: 1, fontSize: 13 } : { marginTop: 2 }} error={otpError ? true : false}>
                                        {otpError || "Enter 6 digit OTP send to your mobile no."}
                                    </FormHelperText>
                                </FormControl>
                                <Button type='submit' color='primary' variant="contained" fullWidth>SUBMIT</Button>
                                <Box
                                    textAlign="right"
                                    my={3}
                                    color="#2065D1"
                                    fontSize={14}
                                    fontWeight="600"
                                >
                                    Please don&apos;t refresh page
                                </Box>
                            </Container>
                        </form>
                    )}
                </Box>
            </Modal>
            <Box sx={{ mx: 2, my: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        onClick={() => {
                            reset({ ...defaultValues, name: user.name, mobile: user.mobile })
                            setModal(!modal)
                        }}
                    >
                        <Tooltip title="Update Profile" >
                            <AccountCircleIcon
                                sx={{ color: 'white', fontSize: 45, cursor: 'pointer' }}
                            />
                        </Tooltip>
                    </StyledBadge>
                    <Typography>
                        {user.name}
                    </Typography>
                </Box>
                <Tooltip title="Revenues" >
                    <IconButton sx={{ p: 2 }} onClick={() => setProfitModal(true)}>
                        <MenuBookIcon sx={{ color: 'white' }} />
                    </IconButton>
                </Tooltip>
                {profitModal ? <Profit show={profitModal} setShow={() => setProfitModal(!profitModal)} /> : null}
            </Box>
        </>
    )
}

export default User