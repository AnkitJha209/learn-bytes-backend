import mongoose, {mongo, Schema} from "mongoose";

const subsectionSchema = new Schema({
    title: {
        type: String,
    },
    timeDuration : {
        type: String,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
    }
})

export const SubSection = mongoose.model("SubSection", subsectionSchema)