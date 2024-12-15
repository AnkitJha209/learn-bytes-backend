import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import otpGen from "otp-generator";
import bcrypt from "bcrypt";
import { Profile } from "../models/profile.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMail } from "../utils/mailSender.js";
dotenv.config({
  path: "./env",
});

export const sentOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({
        success: false,
        msg: "User Already Exist",
      });
    }
    let otp = otpGen.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await Otp.findOne({ otp });
    while (result) {
      otp = otpGen.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp });
    }

    let data = await Otp.create({
      email,
      otp,
    });
    return res.status(200).json({
      success: true,
      msg: "OTP sent Successfully",
      data,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      msg: "Error while sending OTP",
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      phoneNo,
      otp,
    } = req.body;

    if (!firstName || !lastName || !email || !confirmPassword || !password) {
      return res.status(403).json({
        sucess: true,
        msg: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "Password and Confirm Password value does not match please try again",
      });
    }

    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        msg: "User Already Exist please go to log in page",
      });
    }

    const dbOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(dbOtp);

    if (dbOtp.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "OTP Not Found",
      });
    } else if ((otp !== dbOtp[0].otp)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Otp",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      phoneNo,
    });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashPass,
      accountType,
      additionalDetail: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      msg: "User is Registered Successfully",
      newUser,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      msg: "Error while signing up",
    });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        sucess: false,
        msg: "All the fields are required",
      });
    }
    let user = await User.findOne({ email }).populate("additionalDetail");
    console.log(user)
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User Not registered Please Sign up first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      user = user.toObject();
      user.token = token;
      user.password = undefined
      const option = {
        expire: Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
      return res.cookie("token", token, option).status(200).json({
        success: true,
        msg: "Log In Successfully",
        data: user,
      });
    } else {
      return res.status(402).json({
        success: false,
        msg: "Password Does not match",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      msg: "Error while Logging In",
    });
  }
};

export const changePassword = async (req, res) => {
    try {
        const {email, password, newPassword, confirmNewPasword} = req.body
        if(!email || !password || !newPassword || !confirmNewPasword){
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User is not registered"
            })
        }
        if(newPassword !== confirmNewPasword){
            return res.status(400).json({
                success: false,
                msg: "Does not match new password and confirm new password"
            })
        }
        if(await bcrypt.compare(password, user.password)){
            let hashedNewPass = await bcrypt(newPassword, 10)
            user.password = hashedNewPass
            const mailResponse  = await sendMail(email, "Password Changed Successfully", hashedNewPass)
            console.log("Email sent Successfully: ", mailResponse)
            return res.status(200).json({
                success: true,
                msg: "Password Changed Successfully",
                data: user
            })
        }
        else{
            return res.status(400).json({
                success: false,
                msg: "User is not registered"
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            msg: "Error while changing password"
        })
    }
}
