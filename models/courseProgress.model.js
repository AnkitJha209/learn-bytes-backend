import mongoose, {Schema} from "mongoose";

const courseProgressSchema = new Schema({
    courseID: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    completed : [
        {
            type: Schema.Types.ObjectId,
            ref: "SubSection" 
        }
    ]
},{timestamps : true})

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)