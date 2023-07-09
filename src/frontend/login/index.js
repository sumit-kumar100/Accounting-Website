import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Image from 'next/image'
import * as yup from 'yup'
import axios from 'axios'
import decode from 'jwt-decode'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import { Box, InputLabel, InputAdornment, FormControl, Typography, TextField, Button, Container, FormHelperText, Skeleton, IconButton, OutlinedInput } from '@mui/material'

const Subscription = dynamic(() => import('../../components/subscription'), { ssr: false })

const defaultValues = {
    mobile: "9355471196",
    password: "Sumit123#"
}

const Login = () => {
    const validateSchema = {
        mobile: yup.string().required('Mobile no. is required'),
        password: yup.string().required('Password is required').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, One UpperCase & LowerCase, One Number and One Special Character [ @$!%*#?& ]")
    }

    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(yup.object().shape(validateSchema)) })

    const router = useRouter()

    const [isImageReady, setIsImageReady] = useState(false);

    const [pending, setPending] = useState(false)

    const [mobileError, setMobileError] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const [requestID, setRequestID] = useState("")

    const [showOtpForm, setShowOtpForm] = useState(false)

    const [loginError, setLoginError] = useState(null)

    const [otp, setOtp] = useState("123456")

    const [otpError, setOtpError] = useState(null)

    const [newPassword, setNewPassword] = useState("")

    const [passwordError, setPasswordError] = useState(null)

    const [showSubscription, setShowSubscription] = useState(false)

    const onSubmit = async (data, e) => {
        e?.preventDefault()
        setPending(true)
        const response = await axios.post('/api/auth/login-user', { mobile: data.mobile, password: data.password })
        if (response?.data?.status) {
            setLoginError(null)
            const userData = decode(response.data.data.token)
            if (!userData.status) {
                setShowSubscription(true)
                return
            }
            router.replace('/entry-book')
        }
        else {
            setPending(false)
            setLoginError(response?.data?.error)
        }
    }

    const handleForgetPassword = async () => {
        const mobile = getValues("mobile")
        if (mobile === "") {
            setMobileError(true)
            return
        }
        setPending(true)
        const response = await axios.post('/api/auth/forget-password-otp/', { mobile })
        if (response?.data?.status) {
            setPending(false)
            setRequestID(response?.data?.data?.requestID)
            setShowOtpForm(true)
        }
    }

    const handleOTPSubmit = async e => {
        e?.preventDefault()
        if (!newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
            setPasswordError(true)
            return
        }
        setPending(true)
        setPasswordError(null)
        const response = await axios.post('/api/auth/reset-password/', { mobile: getValues('mobile'), requestID, otp, newPassword })
        if (response?.data?.status) {
            toast.success("Password updated successfully")
            setTimeout(() => {
                router.reload(window.location.pathname)
            }, 1000)
        }
        else {
            setPending(false)
            setOtpError(response?.data?.error)
        }
    }

    return (
        <Container>
            <Box sx={{ marginX: { sm: 0, md: 14 }, display: 'flex', boxShadow: '0px 10px 34px -15px rgb(0 0 0 / 24%)', height: '85vh', mt: 4, borderRadius: 1 }}>
                <Box sx={{ width: '45%', display: { xs: 'none', md: 'block' } }}>
                    {!isImageReady && <Skeleton animation="wave" variant="rectangular" width={400} height={450} sx={{ marginTop: 4, marginLeft: 4 }} />}
                    <Image
                        src='/login.svg'
                        alt="Login Image"
                        width={500}
                        height={550}
                        onLoad={() => setIsImageReady(true)}
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', md: '55%' }, padding: { xs: 2, md: 7 } }}>
                    {!showOtpForm ? (<>
                        {!showSubscription ? (
                            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                                <Typography variant="h5" sx={{ letterSpacing: 1 }} textAlign="center">LOGIN</Typography>
                                <Controller
                                    render={({ field }) => (
                                        <TextField
                                            sx={{ mb: 3, mt: 3 }}
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
                                {mobileError ?
                                    <FormHelperText error sx={{ marginBottom: 2, marginLeft: 2 }}>
                                        {"Please enter mobile no. for verification"}
                                    </FormHelperText>
                                    : null}
                                <Controller
                                    render={({ field }) => (
                                        <FormControl sx={{ mb: 1 }} variant="outlined" fullWidth>
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                type={showPassword ? 'text' : 'password'}
                                                error={errors.password ? true : false}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                                {...field}
                                            />
                                            {errors.password ? (
                                                <FormHelperText error>
                                                    {errors.password.message}
                                                </FormHelperText>
                                            ) : null}
                                        </FormControl>

                                    )}
                                    name='password'
                                    control={control}
                                />
                                <Box
                                    onClick={handleForgetPassword}
                                    textAlign="right"
                                    color="#2065D1"
                                    fontSize={14}
                                    fontWeight="600"
                                    sx={{
                                        mb: 2,
                                        cursor: 'pointer'
                                    }}>
                                    Forget password ?
                                </Box>
                                {loginError ?
                                    <FormHelperText error sx={{ marginBottom: 2, marginLeft: 2 }}>
                                        {loginError}
                                    </FormHelperText>
                                    : null}
                                <Button type='submit' disabled={pending} color='primary' variant="contained" fullWidth>{!pending ? "Continue to Login" : "Please wait..."}</Button>
                                <Box
                                    onClick={() => router.replace('/register')}
                                    textAlign="right"
                                    my={3}
                                    color="#2065D1"
                                    fontSize={14}
                                    fontWeight="600"
                                    sx={{
                                        cursor: 'pointer'
                                    }}>
                                    Don&apos;t have account ? Sign Up
                                </Box>
                            </form >) : <Subscription registrationSuccess={false} />}
                    </>) : (
                        <form onSubmit={handleOTPSubmit}>
                            <Typography variant="h5" sx={{ letterSpacing: 1 }} textAlign="center">ENTER OTP AND NEW PASSWORD</Typography>
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
                            <FormControl sx={{ mb: 2 }} variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                <OutlinedInput
                                    type={showPassword ? 'text' : 'password'}
                                    error={passwordError ? true : false}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="New Password"
                                    name="newPassword"
                                />
                                <FormHelperText error={passwordError ? true : false}>
                                    {passwordError ? "Must Contain 8 Characters, One UpperCase & LowerCase, One Number and One Special Character [ @$!%*#?& ]" : ""}
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
                        </form>
                    )}
                </Box>
            </Box>
        </Container >
    )
}

export default Login

