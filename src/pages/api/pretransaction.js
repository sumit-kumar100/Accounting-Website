import https from 'https'
import PaytmChecksum from 'paytmchecksum'
import connectDB from '../../backend/database'
import Models from '../../backend/models'
import utils from '../../backend/utils'
import crypto from 'crypto'
import withProtect from '../../backend/middlewares/withProtect'


const handler = async (req, res) => {
  if (req.method === 'POST') {

    let model = Models['USER']

    const subscription = {
      id: crypto.randomUUID(),
      type: "PAID",
      amount: 1000,
      paymentInfo: "",
      activated_on: new Date(),
      expires_on: utils.auth.addDays(new Date(), 365)
    }

    await model.findByIdAndUpdate(
      req?.user?._id,
      {
        $push: {
          subscriptions: subscription
        }
      }
    )

    let paytmParams = {}

    paytmParams.body = {
      "requestType": "Payment",
      "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
      "websiteName": "YOUR_WEBSITE_NAME",
      "orderId": subscription.id,
      "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
      "txnAmount": {
        "value": subscription.amount,
        "currency": "INR",
      },
      "userInfo": {
        "custId": req?.user?._id,
      },
    }

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.PAYTM_MKEY
    )

    paytmParams.head = {
      "signature": checksum
    }

    var post_data = JSON.stringify(paytmParams)

    const requestAsync = async () => {

      return new Promise((resolve, reject) => {

        var options = {
          hostname: 'securegw-stage.paytm.in',
          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${subscription.id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
          }
        }

        var response = ""

        var post_req = https.request(options, function (post_res) {

          post_res.on('data', function (chunk) {
            response += chunk
          })

          post_res.on('end', function () {
            resolve(JSON.parse(response).body)
          })

        })

        post_req.write(post_data)

        post_req.end()

      })

    }

    const initiatePayment = await requestAsync()

    return res.status(200).json(
      {
        ...initiatePayment,
        orderId: subscription.id,
        amount: subscription.amount
      }
    )

  }

  return res.status(405).json(
    {
      status: false,
      error: "Method Not Allowed"
    }
  )
}


export default connectDB(withProtect(handler))