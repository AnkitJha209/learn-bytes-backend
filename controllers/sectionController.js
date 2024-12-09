import { Section } from "../models/section.model.js";
import {Course} from '../models/course.model.js'
import mongoose, { mongo } from "mongoose";


export const createSection = async (req, res) => {
    try {
        const {sectionName, courseId} = req.body
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                msg: "All Fields are required",
            })
        }
        const newSection = await Section.create({sectionName})
        console.log(newSection)
        const cId = new mongoose.Types.ObjectId(courseId)
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id: cId},
            {$push : {courseContent: newSection._id}},
            {new: true}
        ).populate("courseContent").exec();

        return res.status(200).json({
            success: true,
            msg: "Section Created Successfully",
            newSection,
            updatedCourseDetails
        })
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Failed to create Section",
        })
    }
}

export const updateSection = async (req, res) => {
    try {
        const {sectionId , newName} = req.body 

        if(!sectionId || !newName){
            return res.status(500).json({
                success: false,
                msg: "All Fields are required",
            })
        }
        const secId = new mongoose.Types.ObjectId(sectionId)

        const section = await Section.findByIdAndUpdate({_id: secId},
            {sectionName: newName},
            {new: true},
        ) 
        if(!section){
            return res.status(500).json({
                success: false,
                msg: "Failed to Find the Section",
            })
        }

        return res.status(200).json({
            success: true,
            msg: "Updated Section Successfully",
            section
        })   
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Failed to update Section",
        })
    }
}

export const deleteSection = async (req, res) => {
    try {
        // const {sectionId, courseId} = req.body

        // const section = await Section.findByIdAndDelete({sectionId})

        // const updatedCourseDetails = await Course.findByIdAndUpdate({courseId},
        //     {$pop : {courseContent : section._id}}
        // )

        const {sectionId} = req.body
        const secId = new mongoose.Types.ObjectId(sectionId)
        await Section.findByIdAndDelete({_id: secId})
        return res.status(200).json({
            success: true,
            msg: "Deleted Section Successfully",
            // section
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Failed to delete Section",
        })
    }
}