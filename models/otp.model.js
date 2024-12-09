import mongoose, {Schema} from "mongoose";
import  {sendMail}  from "../utils/mailSender.js";

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

 function sendVerificationEmail(email, otp) {
    try{
        const mailResponse  = sendMail(email, "Verification Email From LearnBytes", otp)
        console.log("Email sent Successfully: ", mailResponse)

    }catch(err){
        console.log("Error occured while sending mails: ",err);
        throw err;
    }
}

otpSchema.pre("save", function(next){
    sendVerificationEmail(this.email, this.otp);
    next();
} )

export const Otp = mongoose.model("Otp", otpSchema)