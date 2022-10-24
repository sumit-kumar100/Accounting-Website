import Models from '../models'
import utils from '../utils'

const withProtect = handler => async (req, res) => {

    let token

    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken
    }


    if (!token) {
        return utils.sendResponse(
            {
                res,
                status: false,
                error: utils.message.UN_AUTHORISED_ROUTE
            }
        )
    }

    try {
        const decoded = utils.auth.verifyToken(token)

        const user = await Models.USER.findById(decoded._id)

        if (!user) {
            return utils.sendResponse(
                {
                    res,
                    status: false,
                    error: utils.message.UN_AUTHORISED_USER
                }
            )
        }

        req.user = user

        return handler(req, res)

    } catch (e) {

        return utils.sendResponse(
            {
                res,
                status: false,
                error: utils.message.UN_AUTHORISED_USER
            }
        )
        
    }
}

export default withProtect