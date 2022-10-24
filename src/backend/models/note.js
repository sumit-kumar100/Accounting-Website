import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
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

const note = mongoose.models.note || mongoose.model("note", schema)

export default note
