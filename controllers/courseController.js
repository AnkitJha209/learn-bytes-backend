import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { uploadImgCloud } from "../utils/imageUploader.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    // data fetching
    // const {id} = req.User
    const { courseName, courseDesc, whatYouWillLearn, price, tag, category } =
      req.body;
    const thumbnail = req.files.thumbnailImg;
    // validation of data
    if (
      !courseName ||
      !courseDesc ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are mandatory ",
      });
    }
    // instructor db call
    const userID = req.user.id;
    console.log(userID)
    const uId = new mongoose.Types.ObjectId(userID)
    console.log(uId)
    const instructorDetails = await User.findById({ _id: uId });
    console.log(instructorDetails);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        msg: "Instructor not Found",
      });
    }

    const categoryId = new mongoose.Types.ObjectId(category)
    const categoryDetails = await Category.findById({ _id: categoryId });
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        msg: "Category Details not Found",
      });
    }

    const thumbnailImg = await uploadImgCloud(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDesc,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag,
      thumbnail: thumbnailImg.secure_url,
    });

    //adding new course to user schema of instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to create Course",
    });
  }
};

export const getAllCoursesByCategory = async (req, res) => {
  try {
    const {catalogName} = req.params
    console.log(catalogName)
    const allCourse = await Course.find(
      {category : catalogName},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        category: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .populate("category")
      .exec();
    return res.status(200).json({
      success: true,
      msg: "All Courses are here",
      data: allCourse,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to Get Courses",
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const allCourse = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        category: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .populate("category")
      .exec();
    return res.status(200).json({
      success: true,
      msg: "All Courses are here",
      data: allCourse,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Failed to Get Courses",
    });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    // console.log(courseId);
    let cId = new mongoose.Types.ObjectId(courseId)
    const courseDetails = await Course.findById({ _id: cId })
      .populate({
        path: "instructor",
        populate: {
            path: "additionalDetail"
        }
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
            path: "subSection"
        }
      })
      .exec();

 
    if (!courseDetails) {
      return res.status(500).json({
        success: false,
        msg: "Could not found Course",
      });
    }
    return res.status(200).json({
        success: true,
        msg: "Course Detail fetched Successfully",
        data: courseDetails
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      msg: "Error while getting details of course",
    });
  }
};
