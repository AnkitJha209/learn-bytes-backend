import mongoose, {Schema} from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

export const Otp = mongoose.model("Otp", otpSchema)