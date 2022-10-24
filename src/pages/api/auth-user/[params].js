import connectDB from '../../../backend/database'
import Models from '../../../backend/models'
import utils from '../../../backend/utils'
import crypto from 'crypto'
import cookie from 'cookie'
import withProtect from '../../../backend/middlewares/withProtect'

const handler = async (req, res) => {

    try {
        let model = Models['USER']

        switch (req?.method) {
            case 'POST':

                switch (req?.query?.params) {

                    case 'activate-free-trial':

                        const user = await model.findById(req?.user?._id)

                        if (utils.auth.isEmptyObject(user.trial)) {

                            user.trial = {
                                id: crypto.randomUUID(),
                                type: "FREE",
                                amount: 0,
                                activated_on: new Date(),
                                expires_on: utils.auth.addDays(new Date(), 30)
                            }

                            user.active_package = user.trial

                            user.status = true

                            user.save()

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

                            return utils.sendResponse(
                                {
                                    res,
                                    data: null,
                                    message: utils.message.FREE_TRIAL_SUCCESS
                                }
                            )
                        }

                        return utils.sendResponse(
                            {
                                res,
                                status: false,
                                statusCode: 500,
                                error: utils.message.FREE_TRIAL_ERROR
                            }
                        )

                    default:
                        res.status(405).end()
                        break
                }
            case 'PUT':

                switch (req?.query?.params) {

                    case 'create-debit-user-cash':

                        await model.findByIdAndUpdate(
                            req?.user?._id,
                            {
                                $push: {
                                    debits: { ...req?.body?.data }
                                }
                            }
                        )

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.UPDATED
                            }
                        )

                    case 'update-debit-user-cash':

                        const debitParams = parseInt(req?.body?.amount) > 0 ? {
                            query: {
                                '_id': req?.user?._id,
                                'debits._id': req?.body?._id
                            },
                            update: {
                                'debits.$.date': req?.body?.date,
                                'debits.$.information': req?.body?.information,
                                'debits.$.mode': req?.body?.mode,
                                'debits.$.amount': req?.body?.amount
                            }
                        } : {
                            query: {
                                '_id': req?.user?._id,
                                'debits._id': req?.body?._id
                            },
                            update: {
                                $pull: {
                                    debits: {
                                        "_id": req?.body?._id
                                    }
                                }
                            }
                        }

                        await model.updateOne(debitParams.query, debitParams.update)

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.UPDATED
                            }
                        )

                    case 'create-credit-user-cash':

                        await model.findByIdAndUpdate(
                            req?.user?._id,
                            {
                                $push: {
                                    credits: { ...req?.body?.data }
                                }
                            }
                        )

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.UPDATED
                            }
                        )

                    case 'update-credit-user-cash':

                        const creditParams = req?.body?.amount > 0 ? {
                            query: {
                                '_id': req?.user?._id,
                                'credits._id': req?.body?._id
                            },
                            update: {
                                'credits.$.date': req?.body?.date,
                                'credits.$.information': req?.body?.information,
                                'credits.$.mode': req?.body?.mode,
                                'credits.$.amount': req?.body?.amount
                            }
                        } : {
                            query: {
                                '_id': req?.user?._id,
                                'credits._id': req?.body?._id
                            },
                            update: {
                                $pull: {
                                    credits: {
                                        "_id": req?.body?._id
                                    }
                                }
                            }
                        }

                        await model.updateOne(creditParams.query, creditParams.update)

                        return utils.sendResponse(
                            {
                                res,
                                data: null,
                                message: utils.message.UPDATED
                            }
                        )

                    case 'update-profile':

                        let profile

                        if (!req?.body?.nameOnly) {
                            const { userData, requestID, otp } = { ...req.body }

                            let OtpModel = Models['OTP']

                            const data = await OtpModel.findOne(
                                {
                                    _id: requestID
                                }
                            )

                            if (!data || data.code !== parseInt(otp)) {
                                return utils.sendResponse(
                                    {
                                        res,
                                        status: false,
                                        error: utils.message.OTP_FAILED
                                    }
                                )
                            }

                            await OtpModel.findByIdAndDelete(requestID)

                            profile = await model.findByIdAndUpdate(
                                req?.user?._id,
                                {
                                    name: userData.name,
                                    mobile: userData.mobile
                                },
                                {
                                    new: true
                                }
                            )

                        } else {
                            profile = await model.findByIdAndUpdate(
                                req?.user?._id,
                                {
                                    name: req?.body?.name
                                },
                                {
                                    new: true
                                }
                            )
                        }

                        const token = utils.auth.createToken(
                            {
                                _id: profile._id,
                                name: profile.name,
                                mobile: profile.mobile,
                                status: profile.status,
                                active_package: profile.active_package
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

                        return utils.sendResponse(
                            {
                                res,
                                data: {
                                    _id: profile._id,
                                    name: profile.name,
                                    mobile: profile.mobile,
                                    status: profile.status,
                                    active_package: profile.active_package
                                },
                                message: utils.message.UPDATED
                            }
                        )

                    default:
                        res.status(405).end()
                        break
                }

            default:
                res.status(405).end()
                break
        }

    } catch (error) {

        return utils.sendResponse(
            {
                res,
                status: false,
                statusCode: 500,
                error: utils.raiseException(error.message)
            }
        )
    }
}

export default connectDB(withProtect(handler))