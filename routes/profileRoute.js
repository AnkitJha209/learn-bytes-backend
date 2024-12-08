import express from "express";
import {auth} from '../middlewares/authorization.js'
import {updateProfile, deleteAccount, getAllUserDetails} from '../controllers/profileController.js'


export const profileRoutes = express.Router();


profileRoutes.put("/update-profile", auth, updateProfile)
profileRoutes.delete("/delete-profile", auth, deleteAccount)
profileRoutes.get("/get-details", auth, getAllUserDetails)
