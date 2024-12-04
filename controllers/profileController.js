import { Profile } from "../models/profile.model.js";
import {User} from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const {gender, dateOfBirth="", about="", contactNo} = req.body
        const userId = req.user.id

        if(!gender || !contactNo || !userId){
            return res.status(400).json({
                success: false,
                msg: "All Fields are required"
            })
        }

        const userDetails = await User.findById({userId})
        const profileId = userDetails.additionalDetail;

        const profileDetails = await Profile.findById({profileId})

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNo = contactNo

        await profileDetails.save();

        return res.status(200).json({
            sucess: true,
            msg: "Profile Updated Successfully",
            profileDetails
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            msg: "Error while updating Profile"
        })
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const {userId} = req.user.id
        if(!userId){
            return res.status(400).json({
                success: false,
                msg: "All Fields are required"
            })
        }

        const user = await User.findById({userId})
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not fount"
            })
        }

        await Profile.findByIdAndDelete({_id: user.additionalDetail})

        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success: true,
            msg : "User Deleted Successfully"
        })
        
    } catch (error) {
        console.log(error.message)
    }
}

export const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findById({id}).populate("additionalDetail").exec();
        if(!user){
            return res.status(400).json({
                success: false,
                msg: "User does not found"
            })
        }
        return res.status(200).json({
            success: true,
            msg: "User Data Fetched",
            user
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            msg: "Error while getting Course"
        })
    }
}