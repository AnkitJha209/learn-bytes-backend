import { SubSection } from "../models/subsection.model.js";
import { Section } from "../models/section.model.js";
import { uploadImgCloud } from "../utils/imageUploader";
import dotenv from 'dotenv'
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

    const updateSectionDetails = await Section.findByIdAndUpdate(
        {sectionId},
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

        const updatedSubSection = await SubSection.findByIdAndUpdate({subSectionId},
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

        await SubSection.findByIdAndDelete({subSectionId})

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
