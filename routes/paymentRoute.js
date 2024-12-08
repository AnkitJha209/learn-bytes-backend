import express from "express";
import { capturePayment, verifySignature } from "../controllers/payment.js";
import { auth, isStudent } from "../middlewares/authorization.js";

export const paymentRoutes = express.Router()

paymentRoutes.post("/capture-payment",auth, isStudent , capturePayment)
paymentRoutes.post("/verify-payment",auth, isStudent, verifySignature)