import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,  
        required: true,
        default: Date.now
    }
})

const otp = mongoose.models.otp || mongoose.model("otp", schema)

export default otp
