import { Tag } from "../models/tag.model.js";

export const createTag = async (req, res) => {
    try {
        const {name, desc} = req.body

        if(!name || !desc){
            return res.status(400).json({
                success: false, 
                msg: "All fields are required"
            }) 
        }

        const isPresent = await Tag.findOne({name})
        if(isPresent){
            return res.status(402).json({
                success: false, 
                msg: "Tag Already Present"
            })
        } 

        const tagDetails = await Tag.create({
            name,
            desc
        })

        return res.status(200).json({
            success: true,
            msg: "Tag Created Successfully",
            tagDetails
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false, 
            msg: "Error while creating tag"
        })
    }
}

export const getAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({},{name:true, desc: true})
        return res.status(200).json({
            success: true, 
            msg: "All Tags Returned Successfully",
            allTags
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false, 
            msg: "Error while creating tag"
        })
    }
}