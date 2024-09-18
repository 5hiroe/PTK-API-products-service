import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stockQuantity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Product', schema)