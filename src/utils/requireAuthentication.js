import axios from 'axios'
import decode from 'jwt-decode'

const requireAuthentication = (gssp) => {
    return async (context) => {
        const { req, res } = context;
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return {
                redirect: {
                    destination: '/login',
                    statusCode: 302
                }
            }
        }
        const response = await axios.post('/api/auth/verify-user', { accessToken })
        if (response?.data?.status) {
            const account = decode(accessToken)
            if (account.status === true) {
                return await gssp(context)
            }
        }
        return {
            redirect: {
                destination: '/login',
                statusCode: 302
            }
        }
    }
}

export default requireAuthentication