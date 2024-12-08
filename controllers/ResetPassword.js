import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import { sendMail } from "../utils/mailSender.js";
import bcrypt from 'bcrypt'

dotenv.config({
  path: "./env",
});

export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email){
        return res.status(500).json({
            success: false,
            msg: "please fill the field"
        })
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        msg: "user does not exist",
      });
    }

    const resetToken = crypto.randomUUID();
    const updateDetails = await User.findOneAndUpdate(
        {email},
        {resetToken: resetToken, resetExpires: Date.now() + 5 * 60 * 1000}, 
        {new: true}
    )
    const url = `http://localhost:3000/update-password/${resetToken}`
    await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`)

    return res.status(200).json({
        success: true,
        message: "Email Sent Successfully Please Check Your Mail Box"
    })

  } catch (err) {
    console.log(err.message);
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        msg: "user does not exist",
      });
    }
  }
};

export const resetPassword = async (req, res) => {
    try {
        const {resetToken, password, confirmPassword} = req.body;
        if(!password || !confirmPassword){
            return res.status(500).json({
                success: false,
                msg: "Please fill all the Fields",
            }); 
        }
        if(password !== confirmPassword){
            return res.status(500).json({
                success: false,
                msg: "Password and Confirm Password Does not match",
              });
        }
        const user = await User.findOne({resetToken})
        if(!user){
            return res.status(500).json({
                success: false,
                msg: "Either User Does not exit",
              });
        }
        if(user.resetExpires < Date.now()){
            return res.status(500).json({
                success: false,
                msg: "Link Expired",
              });
        }
        let hashedPass = await bcrypt(password, 10);
        user.password = hashedPass
        return res.status(200).json({
            success: true,
            msg: "Password Changed Successfully",
          });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Error while changing password",
          });
    }
}
