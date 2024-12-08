import express from 'express'
import {signUp, sentOTP, changePassword, logIn} from '../controllers/Auth.js'
import {resetPassword, resetPasswordToken} from '../controllers/ResetPassword.js'
import {auth} from '../middlewares/authorization.js'


export const userRoute = express.Router()

userRoute.post("/login", logIn)

userRoute.post("/sign-up", signUp)

userRoute.post("/send-otp", sentOTP)

userRoute.post("/change-password", auth, changePassword)

userRoute.post("/reset-password", resetPassword)

userRoute.post("/reset-password-token", resetPasswordToken)

