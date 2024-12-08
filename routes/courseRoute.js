import express from "express";
import {auth, isAdmin, isInstructor, isStudent} from '../middlewares/authorization.js'
import {createCourse, getAllCourses, getCourseDetails} from '../controllers/courseController.js'
import {createCategory, getAllCategory, categoryPageDetails} from '../controllers/categoryController.js'
import { createSection, deleteSection, updateSection } from "../controllers/sectionController.js";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/subSectionController.js";
import { createReviewAndRating, getAllRating, getAverageRating } from "../controllers/ratingAndReviewController.js";



export const courseRoutes = express.Router();

courseRoutes.post("/create-category", auth, isAdmin, createCategory)
courseRoutes.get("/all-categories", getAllCategory)
courseRoutes.get("/get-category-details", categoryPageDetails)


courseRoutes.get("/get-all-courses", getAllCourses)
courseRoutes.get("get-course-details", getCourseDetails)

courseRoutes.post("/create-course", auth, isInstructor, createCourse)
courseRoutes.post("/create-section", auth, isInstructor, createSection)
courseRoutes.put("/update-section", auth, isInstructor, updateSection)
courseRoutes.delete("/delete-section", auth, isInstructor, deleteSection)
courseRoutes.post("/create-sub-section", auth, isInstructor, createSubSection)
courseRoutes.put("update-sub-section", auth, isInstructor, updateSubSection)
courseRoutes.delete("/delete-sub-section", auth, isInstructor, deleteSubSection)


courseRoutes.post("/create-rating", auth, isStudent, createReviewAndRating)
courseRoutes.get("/get-avg-rating", getAverageRating)
courseRoutes.get("/get-all-rating", getAllRating)
