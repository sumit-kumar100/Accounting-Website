import mongoose from 'mongoose'

const mongoAtlasUri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zuifn.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`

const connectDB = handler => async (req, res) => {
    await mongoose.connect(mongoAtlasUri)
    return handler(req, res)

}

export default connectDB