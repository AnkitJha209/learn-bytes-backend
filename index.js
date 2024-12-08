import express from "express";
import dotenv from 'dotenv'
import { userRoute } from "./routes/userRoute.js";
import { profileRoutes } from "./routes/profileRoute.js";
import { courseRoutes } from "./routes/courseRoute.js";
import { paymentRoutes } from "./routes/paymentRoute.js";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import fileUpload from "express-fileupload";
import { cloudinaryConnect } from "./config/cloudinary.js";
dotenv.config({
    path: './env'
})


const app = express()
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
connectDB();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
