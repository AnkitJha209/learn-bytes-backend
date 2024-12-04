import { Category } from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const {name, desc} = req.body

        if(!name || !desc){
            return res.status(400).json({
                success: false, 
                msg: "All fields are required"
            }) 
        }

        const isPresent = await Category.findOne({name})
        if(isPresent){
            return res.status(402).json({
                success: false, 
                msg: "Category Already Present"
            })
        } 

        const categoryDetails = await Category.create({
            name,
            desc
        })

        return res.status(200).json({
            success: true,
            msg: "Category Created Successfully",
            categoryDetails
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false, 
            msg: "Error while creating tag"
        })
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({},{name:true, desc: true})
        return res.status(200).json({
            success: true, 
            msg: "All Category Returned Successfully",
            allCategory
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false, 
            msg: "Error while creating Category"
        })
    }
}