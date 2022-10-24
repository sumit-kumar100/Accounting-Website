import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        trim: true,
        default: "USER"   // USER-OR-ADMIN
    },
    trial: {
        type: Object,
        required: false,
        default: {}
    },
    subscriptions: [
        {
            type: Object,
            required: false,
            default: {}
        }
    ],
    active_package: {
        type: Object,
        required: false,
        default: {}
    },
    debits: [
        {
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            information: {
                type: String,
                required: true,
                trim: true
            },
            mode: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    credits: [
        {
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            information: {
                type: String,
                required: true,
                trim: true
            },
            mode: {
                type: String,
                required: true,
                trim: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    status: {
        type: Boolean,
        required: true,
        default: false
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

const user = mongoose.models.user || mongoose.model("user", schema)

export default user
