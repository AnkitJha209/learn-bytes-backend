import { RatingAndReview } from "../models/ratingAndReview.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const createReviewAndRating = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user.id;
    if (!courseId || !userId) {
      return res.status(500).json({
        success: false,
        msg: "All fields are required",
      });
    }
    // const course = await Course.findById({courseId})
    // if(!course){
    //     return res.status(404).json({
    //         success: false,
    //         msg: "No course found"
    //     })
    // }
    // let uId = new mongoose.Types.ObjectId(userId)
    // if(!course.studentsEnrolled.includes(uId)){
    //     return res.status(404).json({
    //         success: false,
    //         msg: "User is not enrolled in this course"
    //     })
    // }

    // const user = await User.findById({userId}).populate("additionalDetail")

    const course = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!course) {
      return res.status(400).json({
        success: false,
        msg: "Student is not enrolled in a course",
      });
    }

    const userReviewExist = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (userReviewExist) {
      return res.status(403).json({
        success: false,
        msg: "Course is Already Reviewed by the user",
      });
    }

    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReviews: ratingAndReview._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Rating and Review Successfully Added",
      data: ratingAndReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error while creating rating and review",
    });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const avg = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        msg: "Got Average Rating",
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Average Rating is zero no ratings given till now",
        averageRating: 0,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Could not get average rating",
    });
  }
};

export const getAllRating = async (req, res) => {
  const ratingAndReviews = await RatingAndReview.find()
    .sort({ rating: "desc" })
    .populate({
      path: "user",
      select: "firstName lastName email image",
    })
    .populate({
        path: "course",
        select: "courseName"
    }).exec();

    if (!ratingAndReviews) {
    return res.status(500).json({
      success: false,
      msg: "No Rating And Review for this course yet",
    });
  }
  return res.status(200).json({
    success: true,
    msg: "Rating And Review Fetched Successfully",
    data: ratingAndReviews,
  });
};
