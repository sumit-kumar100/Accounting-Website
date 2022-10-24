import cookie from 'cookie'
import utils from '../../backend/utils'
import connectDB from '../../backend/database'
import Models from '../../backend/models'
import CheckSum from 'paytmchecksum'


const handler = async (req, res) => {
    // Validating CheckSum
    let paytmCheckSum = ""

    let paytmParams = {}

    const received_data = req?.body

    for (let key in received_data) {
        key === 'CHECKSUMHASH' ? paytmCheckSum = received_data[key] : paytmParams[key] = received_data[key]
    }

    let isValidCheckSum = CheckSum.verifySignature(paytmParams, process.env.PAYTM_MKEY, paytmCheckSum)

    if (!isValidCheckSum) {
        return res.status(500).send("Internal Server Error")
    }

    // Updating Subscripiton Status
    let model = Models['USER']

    if (req?.body?.STATUS === 'TXN_SUCCESS') {

        const user = await model.findOneAndUpdate(
            {
                'subscriptions.id': req?.body?.ORDERID
            },
            {
                'subscriptions.$.paymentInfo': JSON.stringify(req?.body)
            }
        )

        const dues = user.subscriptions.find(row => row.id === req?.body?.ORDERID)

        if (dues) {

            user.active_package = {
                id: dues.id,
                type: dues.type,
                amount: dues.amount,
                activated_on: dues.activated_on,
                expires_on: dues.expires_on
            }

            user.status = true

            user.save()
        }

        const token = utils.auth.createToken(
            {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                status: user.status,
                active_package: user.active_package
            }
        )

        res.setHeader(
            'Set-Cookie',
            cookie.serialize(
                'accessToken',
                token,
                {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/'
                }
            )
        )

        res.redirect('/entry-book?success=true', 200)
        
        return
    }

    return res.status(500).send("Internal Server Error")
}


export default connectDB(handler)