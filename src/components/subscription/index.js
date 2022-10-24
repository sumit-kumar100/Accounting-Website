import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import axios from 'axios'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { Box, CardActions, CardContent, Button, Typography, ListItem, ListItemText, Alert, Modal, CircularProgress } from '@mui/material'
import { useState } from 'react'

const Subscription = ({ registrationSuccess }) => {
    const router = useRouter()

    // const data = [
    //     {
    //         text: "Sale & Purchases book"
    //     },
    //     {
    //         text: "Vendor & Customers book"
    //     },
    //     {
    //         text: "Cash book"
    //     },
    //     {
    //         text: "Sale, purchase, vendor & customer ledger"
    //     },
    //     {
    //         text: "Profits , notes & more"
    //     }
    // ]
    const data = [
        {
            text: "A fully managed Single Entry System"
        },
        {
            text: "Auto prepare Sale & Purchases book"
        },
        {
            text: "Auto prepare Sale & Purchases ledger"
        },
        {
            text: "Auto prepare Cash Book"
        },
        {
            text: "Profits , notes & more"
        }
    ]

    const [loading, setLoading] = useState(false)

    const getSubscription = async () => {
        setLoading(true)
        let response = await axios.post('/api/pretransaction')
        var config = {
            "root": "",
            "flow": "DEFAULT",
            "data": {
                "orderId": response?.data?.orderId,
                "token": response?.data?.txnToken,
                "tokenType": "TXN_TOKEN",
                "amount": response?.data?.amount
            },
            "handler": {
                "notifyMerchant": function (eventName, data) {
                    console.log("notifyMerchant handler function called");
                    console.log("eventName => ", eventName);
                    console.log("data => ", data);
                }
            }
        }
        window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
            setLoading(false)
            window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error) {
            setLoading(false)
            console.log("error => ", error);
        })
    }

    const activateFreeTrial = async () => {
        setLoading(true)
        const response = await axios.post('/api/auth-user/activate-free-trial')
        if (response?.data?.status) {
            router.replace('/entry-book')
            return
        }
        setLoading(false)
        router.replace('/login')
    }
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
            {/* <Head>
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
            </Head> */}
            <Modal open={loading} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                    <CircularProgress sx={{ color: 'white' }} />
                </Box>
            </Modal>
            {registrationSuccess ? <Alert severity="success" sx={{ marginTop: -3, marginBottom: 1, alignSelf: 'center' }}  >Account created successfully .</Alert> : null}
            <CardContent sx={{ paddingTop: 0, paddingBottom: 1, paddingRight: 0 }}>
                <Typography variant="h5" textAlign="center" component="div">
                    Our Plan
                </Typography>
                <Typography sx={{ mb: 1.5, mt: 1 }} textAlign="center" color="text.secondary">
                    {"For managing your business & Accounts"}
                </Typography>
                {data?.map((item, index) => (
                    <ListItem key={index} sx={{ marginBottom: -3 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 18, marginRight: 1, marginTop: 0.5 }} color="success" />
                        <ListItemText
                            primary={item.text}
                        />
                    </ListItem>
                ))}
                {/* <Typography sx={{ mt: 3, color: '#d50a0a' }} textAlign="center">
                    {"MANAGE ALL BOOKS WITH ONE ENTRY BOOK"}
                </Typography> */}
            </CardContent>
            <CardActions sx={{ paddingX: 2, paddingY: 4, display: 'block' }}>
                <Button size="small" variant="contained" fullWidth disabled onClick={activateFreeTrial}>GET SUBSCRIPTION</Button>
                <Box textAlign="center" my={1} fontFamily="italic">OR</Box>
                <Button size="small" variant="contained" color="primary" fullWidth onClick={activateFreeTrial}>30 DAYS FREE TRIAL</Button>
            </CardActions>
            {/* <Script type="application/javascript" crossOrigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`} /> */}
        </Box>
    )
}

export default Subscription