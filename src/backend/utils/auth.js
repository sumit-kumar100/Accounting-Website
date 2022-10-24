import jwt from 'jsonwebtoken'

const Auth = {
    createToken: data => {
        return jwt.sign(data, process.env.JWT_SECRET_KEY, {})
    },
    verifyToken: (token) => {
        let verified
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                verified = false
            }
            verified = decoded
        })
        return verified
    },
    isEmptyObject: (obj) => {
        return Object.keys(obj).length === 0
    },
    addDays: (date, days) => {
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
    }
}

export default Auth