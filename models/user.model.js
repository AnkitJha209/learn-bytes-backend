import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    firstName : {
        type: String,
        required: true,
        trim: true
    },
    lastName : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum : ['Admin', 'Student', 'Instructor'],
        required : true,
    },
    additionalDetail : {
        type : Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    courses : [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }],
    image: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
    },
    resetExpires: {
        type: Date
    },
    courseProgress: [
        {
            type: Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],
},{timestamps: true})

export const User = mongoose.model("User", userSchema)