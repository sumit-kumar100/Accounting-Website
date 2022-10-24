import CustomAxios from 'axios'

export default function createAxios(cookie) {
    return CustomAxios.create({
        baseURL: process.env.NEXT_PUBLIC_HOST,
        headers: {
            'Cookie': `accessToken=${cookie};`
        }
    })
}