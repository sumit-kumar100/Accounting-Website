import cookie from 'cookie'
import CryptoJs from 'crypto-js'
import connectDB from '../../../backend/database'
import Models from '../../../backend/models'
import utils from '../../../backend/utils'

const handler = async (req, res) => {
    try {
        if (req.method === 'POST') {
            
            let model = Models['USER']

            let OtpModel = Models['OTP']

            switch (req?.query?.params) {
                case 'send-otp':
                    const isMobileExist = await model.findOne(
                        {
                            mobile: req?.body?.mobile
                        }
                    )

                    if (isMobileExist) {
                        return utils.sendResponse(
                            {
                                res,
                                status: false,
                                error: utils.message.MOBILE_EXIST
                            }
                        )
                    }
                    const resp = await OtpModel.create(
                        {
                            code: 123456
                        }
                    )
                    return utils.sendResponse(
                        {
                            res,
                            data: { requestID: resp._id },
                            message: utils.message.SEND_OTP
                        }
                    )

                case 'create-user':
                    const { userData, requestID, otp } = { ...req.body }

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

                    const registration = await model.create(
                        {
                            name: userData.name,
                            mobile: userData.mobile,
                            password: CryptoJs.AES.encrypt(userData.password, process.env.PASSWORD_KEY).toString()
                        }
                    )

                    const account = Models['CUSTOMER']

                    await account.create(
                        {
                            name: `Balance Account-${registration._id}`,
                            type: 'BALANCE',
                            auth: registration._id
                        }
                    )
                    await account.create(
                        {
                            name: `Loss Account-${registration._id}`,
                            type: 'LOSS',
                            auth: registration._id
                        }
                    )
                    const registrationToken = utils.auth.createToken(
                        {
                            _id: registration._id,
                            name: registration.name,
                            mobile: registration.mobile,
                            status: registration.status,
                            active_package: registration.active_package
                        }
                    )

                    res.setHeader(
                        'Set-Cookie',
                        cookie.serialize(
                            'accessToken',
                            registrationToken,
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
                            message: utils.message.CREATED
                        }
                    )

                case 'login-user':
                    const user = await model.findOne(
                        {
                            mobile: req?.body?.mobile
                        }
                    )

                    if (!user || CryptoJs.AES.decrypt(user.password, process.env.PASSWORD_KEY).toString(CryptoJs.enc.Utf8) !== req?.body?.password) {
                        return utils.sendResponse(
                            {
                                res,
                                status: false,
                                error: utils.message.LOGIN_FAILED
                            }
                        )
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

                    return utils.sendResponse(
                        {
                            res,
                            data: { token },
                            message: utils.message.LOGIN_SUCCESS
                        }
                    )

                case 'logout-user':
                    res.setHeader(
                        'Set-Cookie',
                        cookie.serialize(
                            'accessToken',
                            "",
                            {
                                httpOnly: true,
                                expires: new Date(0),
                                sameSite: 'strict',
                                path: '/'
                            }
                        )
                    )

                    return utils.sendResponse(
                        {
                            res,
                            data: null,
                            message: utils.message.LOGOUT_SUCCESS
                        }
                    )

                case 'verify-user':
                    const decoded = utils.auth.verifyToken(req?.body?.accessToken)

                    if (!decoded) {
                        return utils.sendResponse(
                            {
                                res,
                                status: false,
                                error: utils.message.JWT_ERROR
                            }
                        )
                    }

                    return utils.sendResponse(
                        {
                            res,
                            data: decoded,
                            message: utils.message.JWT_VERIFIED
                        }
                    )

                case 'forget-password-otp':

                    const response = await OtpModel.create(
                        {
                            code: 123456
                        }
                    )

                    return utils.sendResponse(
                        {
                            res,
                            data: { requestID: response._id },
                            message: utils.message.SEND_OTP
                        }
                    )

                case 'reset-password':

                    const otp_data = await OtpModel.findOne(
                        {
                            _id: req.body.requestID
                        }
                    )

                    if (!otp_data || otp_data.code !== parseInt(req.body.otp)) {
                        return utils.sendResponse(
                            {
                                res,
                                status: false,
                                error: utils.message.OTP_FAILED
                            }
                        )
                    }

                    await OtpModel.findByIdAndDelete(req.body.requestID)

                    await model.updateOne(
                        {
                            mobile: req.body.mobile
                        },
                        {
                            password: CryptoJs.AES.encrypt(req.body.newPassword, process.env.PASSWORD_KEY).toString()
                        }
                    )

                    return utils.sendResponse(
                        {
                            res,
                            data: null,
                            message: utils.message.UPDATED
                        }
                    )
                    
                default:
                    res.status(405).end()
                    break
            }
        }
        return utils.sendResponse(
            {
                res,
                status: false,
                statusCode: 500,
                error: utils.message.METHOD_NOT_ALLOWED
            }
        )
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

export default connectDB(handler)