import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    vendor: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    charges: {
        type: Number,
        required: true,
        default: 0
    },
    sales: [
        {
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            details: {
                type: String,
                required: true,
                trim: true
            },
            customer: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            charges: {
                type: Number,
                required: true,
                default: 0
            },
            status: {
                type: Boolean,
                required: true,
                default: true
            },
            mode: {
                type: String,
                required: true,
                default: "CREDIT"
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
        }
    ],
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    mode: {
        type: String,
        required: true,
        default: "CREDIT"
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

const entry = mongoose.models.entry || mongoose.model("entry", schema)

export default entry

