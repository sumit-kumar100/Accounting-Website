import dynamic from 'next/dynamic'
import decode from 'jwt-decode'

const RegisterUser = dynamic(() => import('../frontend/register'), { ssr: true })

const Register = () => {
    return (
        <RegisterUser />
    )
}

export default Register


export async function getServerSideProps(context) {
    const { req, res } = context
    const accessToken = req.cookies.accessToken
    if (accessToken) {
        const response = await axios.post('/api/auth/verify-user', { accessToken })
        if (response?.data?.status) {
            const account = decode(accessToken)
            if (account.status === true) {
                return {
                    redirect: {
                        destination: '/entry-book',
                        statusCode: 302
                    }
                }
            }
        }
    }
    return { props: {} }
}