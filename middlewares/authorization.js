import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})

export const auth = async (req, res, next) => {
     try {
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token
        
        if(!token){
            return res.status(500).json({
                success: false,
                msg: "Token Missing"
            })
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload)
            req.user = payload;
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: "Token is Invalid"
            })
        }
        next();
     } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Error while authorization"
        })
     }
}

export const isStudent = async (req, res, next) => {
    try {
        if(req.user.role !== "Student"){
            return res.status(500).json({
                success: false,
                msg: "This is a protected route for students only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "User Role cannot be verified"
        })
    }
}

 

export const isInstructor = async (req, res, next) => {
    try {
        if(req.user.role !== "Instructor"){
            return res.status(500).json({
                success: false,
                msg: "This is a protected route for instructor only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "User Role cannot be verified"
        })
    }
}


export const isAdmin = async (req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(500).json({
                success: false,
                msg: "This is a protected route for admin only"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "User Role cannot be verified"
        })
    }
}