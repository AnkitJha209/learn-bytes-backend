import { SubSection } from "../models/subsection.model.js";
import { Section } from "../models/section.model.js";
import { uploadImgCloud } from "../utils/imageUploader.js";
import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config({
    path: './env'
})

export const createSubSection = async (req, res) => {
  try {
    const {title, timeDuration, description, sectionId} = req.body
    const video = req.files.videoFile
    if(!title || !timeDuration || !description || !sectionId || !video){
        return res.status(400).json({
            success: false,
            msg: "All fields are mandatory"
        })
    }

    const uploadDetails = await uploadImgCloud(video, process.env.FOLDER_NAME) 

    const subsectionDetails = await SubSection.create({
        title,
        timeDuration,
        description,
        videoUrl : uploadDetails.secure_url
    })

    const secId = new mongoose.Types.ObjectId(sectionId)
    const updateSectionDetails = await Section.findByIdAndUpdate(
        {_id: secId},
        {$push: {subSection: subsectionDetails}},
        {new: true}
    ).populate("subSection").exec();

    return res.status(200).json({
        success: true,
        msg: "Sub Section Created Successfully",
        subsectionDetails,
        updateSectionDetails
    })

  } catch (error) {
    console.log(error.message)
    return res.status(400).json({
        success: false,
        msg: "Error while creating subsection"
    })
  }
};

export const updateSubSection = async (req, res) => {
    try {
        const {subSectionId, title, description, timeDuration} = req.body
        const video = req.files.videoFile;

        if(!title || !timeDuration || !description || !subSectionId || !video){
            return res.status(400).json({
                success: false,
                msg: "All fields are mandatory"
            })
        }

        const uploadDetails = await uploadImgCloud(video, process.env.FOLDER_NAME) 
        const subSecId = new mongoose.Types.ObjectId(subSectionId)
        const updatedSubSection = await SubSection.findByIdAndUpdate({_id: subSecId},
            {title, description, timeDuration, videoUrl: uploadDetails.secure_url},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            msg: "Sub Section Created Successfully",
            updatedSubSection
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Error while Updating sub section"
        })
    }
}

export const deleteSubSection = async (req, res) => {
    try {
        const {subSectionId} = req.params;
        const subSecId = new mongoose.Types.ObjectId(subSectionId)
        await SubSection.findByIdAndDelete({_id: subSecId})

        return res.status(200).json({
            success: true,
            msg: "Subsection Deleted Successfully"
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Error while Updating sub section"
        })
    }
}
