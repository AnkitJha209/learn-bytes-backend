import mongoose, {Schema} from "mongoose";

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc : {
        type: String,
        trim: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    }
},{timestamps: true})

export const Tag = mongoose.model("Tag", tagSchema)