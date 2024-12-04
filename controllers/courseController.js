import {Course} from "../models/course.model.js"
import { User } from "../models/user.model.js";
import { uploadImgCloud } from "../utils/imageUploader.js";
import { Category } from "../models/category.model.js";

export const createCourse = async (req, res) => {
    try {
        // data fetching 
        // const {id} = req.User
        const{courseName, courseDesc, whatYouWillLearn, price, tag, category} = req.body
        const thumbnail = req.files.thumbnailImg;
        // validation of data
        if(!courseName || !courseDesc || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                msg: "All fields are mandatory "
            })
        }
        // instructor db call
        
        const userID = req.user.id;
        const instructorDetails = await User.findById({userID});
        console.log(instructorDetails)
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                msg: "Instructor not Found"
            })
        }

        const categoryDetails = await Category.findById({category});
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                msg: "Category Details not Found"
            })
        }

        const thumbnailImg = await uploadImgCloud(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDesc,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImg.secure_url,
        })

        //adding new course to user schema of instructor

        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {$push : {courses: newCourse._id}},
            {new: true}
        )

        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {$push : {courses : newCourse._id}},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            msg: "Course Created Successfully",
            data: newCourse,
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Failed to create Course",
        })
        
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const allCourse = await Course.find(
            {},
            {courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        ).populate("instructor").exec();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            msg: "Failed to Get Courses",
        }) 
    }
}
