import mongoose from "mongoose";
import { instance } from "../config/razorpay.js";
import {Course} from '../models/course.model.js'
import { User } from "../models/user.model.js";
import {sendMail} from '../utils/mailSender.js'

export const capturePayment = async (req, res) => {
    const {courseId} = req.body
    const userId = req.user.id

    if(!courseId || !userId){
        return res.status(500).json({
            success: false,
            msg: "All Fields are neccessary"
        })
    }

    let course; 
    let user; 
    try{
        course = await Course.findById({courseId})
        if(!course){
            return res.status(500).json({
                success: false,
                msg: "Could not find Course"
            })
        }

        user = await User.findById({userId})
        if(!user){
            return res.status(500).json({
                success: false,
                msg: "Could not find User"
            })
        }

        const uId = new mongoose.Types.ObjectId(userId)
        if(course.studentsEnrolled.includes(uId)){
            return res.status(500).json({
                success: false,
                msg: "Student is already Enrolled"
            })
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            msg: "Error while Capturing the Payment"
        })
    }

    const amount = course.price
    const currency = "INR"
    

    const options = {
        amount : amount * 100,
        currency,
        receipt: Math.random(Data.now()).toString(),
        notes: {
            courseId,
            userId
        }
    }

    try {
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDesc: course.courseDesc,
            thumnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error while creating payment response"
        })
    }
}

export const verifySignature = async (req, res) => {
    const webhookSecret = '12345678'
    const signature = req.headers["x-razorpay-signature"]

    const shasum = crypto.createHmac('sha256',webhookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex")

    if(signature === digest){
        console.log("Payment is Authorized")
        const {courseId, userId} = req.body.payload.payment.entity.notes

        try{
            const enrolledCourse = await Course.findByIdAndUpdate(
                {courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true}
            ).populate("studentsEnrolled").exec();
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    msg: "Course not found"
                })
            }
            console.log(enrolledCourse)
            const userCourses = await User.findByIdAndUpdate(
                {userId},
                {$push : {courses: courseId}},
                {new: true}
            ).populate("courses").exec();

            if(!userCourses){
                return res.status(500).json({
                    success: false,
                    msg: "User not found"
                })
            }
            console.log(userCourses);

            const emailRes = await mailSender(
                userCourses.email,
                "Congrats You have enrolled in a course",
                "Learn Bytes"
            )
            console.log(emailRes)
            return res.status(200).json({
                success: true,
                msg: "Student is successfully Enrolled in a Course"
            })
        }catch(err){
            return res.status(500).json({
                success: false,
                msg: err.message
            })
        }
    }
    else{
        return res.stauts(400).json({
            success: false,
            msg: "Invalid Req"
        })
    }
}