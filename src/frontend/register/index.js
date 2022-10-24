import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import * as yup from 'yup'
import Image from 'next/image'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"
import { useState } from 'react'
import { Box, Typography, TextField, Button, Container, FormHelperText, IconButton, OutlinedInput, InputLabel, FormControl, InputAdornment, Skeleton } from '@mui/material'

const Subscription = dynamic(() => import('../../components/subscription'), { ssr: false })

const defaultValues = {
    name: "",
    mobile: "",
    password: ""
}

const SignUp = () => {

    const validateSchema = {
        name: yup.string().required('Name is required'),
        mobile: yup.string().required('Mobile no. is required'),
        password: yup.string().required('Password is required').matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, One UpperCase & LowerCase, One Number and One Special Character [ @$!%*#?& ]")
    }

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ defaultValues, resolver: yupResolver(yup.object().shape(validateSchema)) })

    const [isImageReady, setIsImageReady] = useState(false);

    const [pending, setPending] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const [showOtpForm, setShowOtpForm] = useState(false)

    const [userData, setUserData] = useState(null)

    const [requestID, setRequestID] = useState("")

    const [formError, setFormError] = useState(null)

    const [otp, setOtp] = useState("123456")

    const [otpError, setOtpError] = useState(null)

    const [showSubscription, setShowSubscription] = useState(false)

    const [registrationSuccess, setRegistrationSuccess] = useState(true)

    const router = useRouter()

    const onSubmit = async (data, e) => {
        e?.preventDefault()
        setPending(true)
        const response = await axios.post('/api/auth/send-otp/', { mobile: data.mobile })
        if (response?.data?.status) {
            setRequestID(response?.data?.data?.requestID)
            setShowOtpForm(true)
            setUserData(data)
            setFormError(null)
            reset({ ...defaultValues })
        }
        setPending(false)
        setFormError(response?.data?.error)
    }

    const handleOTPSubmit = async e => {
        e?.preventDefault()
        setPending(true)
        const response = await axios.post('/api/auth/create-user/', { userData, requestID, otp })
        if (response?.data?.status) {
            setOtpError(null)
            setShowSubscription(true)
        }
        setPending(false)
        setOtpError(response?.data?.error)
    }

    return (
        <>
            {!showOtpForm ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
                                <Typography variant="h5" sx={{ letterSpacing: 1 }} textAlign="center">SIGN UP</Typography>
                                <Controller
                                    render={({ field }) => (
                                        <TextField
                                            sx={{ mt: 2 }}
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
                                <Controller
                                    render={({ field }) => (
                                        <FormControl sx={{ mb: 2 }} variant="outlined" fullWidth>
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
                                <Button type='submit' color='primary' disabled={pending} variant="contained" fullWidth>{!pending ? "Continue to Sign Up" : "Please wait..."}</Button>
                                <Box
                                    onClick={() => router.replace('/login')}
                                    textAlign="right"
                                    my={3}
                                    color="#2065D1"
                                    fontSize={14}
                                    fontWeight="600"
                                    sx={{
                                        cursor: 'pointer'
                                    }}>
                                    Already have account ? Login
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </form>
            ) : (
                <form onSubmit={handleOTPSubmit}>
                    <Container>
                        <Box sx={{ marginX: { sm: 0, md: 14 }, display: 'flex', boxShadow: '0px 10px 34px -15px rgb(0 0 0 / 24%)', height: '85vh', mt: 4, borderRadius: 1 }}>
                            <Box sx={{ width: '45%', display: { xs: 'none', md: 'block' } }}>
                                {!isImageReady && <Skeleton animation="wave" variant="rectangular" width={400} height={450} sx={{ marginTop: 4, marginLeft: 4 }} />}
                                <Image
                                    src='/login.svg'
                                    alt="Login Image"
                                    width={500}
                                    height={550}
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', md: '55%' }, padding: { xs: 2, md: 7 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {!showSubscription ? (
                                    <>
                                        <Typography variant="h5" sx={{ letterSpacing: 1 }} textAlign="center">ENTER OTP</Typography>
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
                                        <Button type='submit' color='primary' disabled={pending} variant="contained" fullWidth>{!pending ? "SUBMIT" : "Please wait..."}</Button>
                                        <Box
                                            textAlign="right"
                                            my={3}
                                            color="#2065D1"
                                            fontSize={14}
                                            fontWeight="600"
                                        >
                                            Please don&apos;t refresh page
                                        </Box>
                                    </>
                                ) : <Subscription registrationSuccess={registrationSuccess} />}
                            </Box>
                        </Box>
                    </Container>
                </form>
            )}
        </>
    )
}

export default SignUp
