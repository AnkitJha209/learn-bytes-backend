import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc : {
        type: String,
        trim: true,
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
    }]
},{timestamps: true})

export const Category = mongoose.model("Category", categorySchema)