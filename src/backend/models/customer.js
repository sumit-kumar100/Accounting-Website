import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        get: name => name.split("-")[0]
    },
    debit: {
        type: Number,
        required: true,
        default: 0
    },
    credit: [
        {
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            },
            mode: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    type: {
        type: String,
        required: true,
        default: "ACCOUNT"
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
}, { toJSON: { getters: true }, toObject: { getters: true } })

const customer = mongoose.models.customer || mongoose.model("customer", schema)

export default customer
