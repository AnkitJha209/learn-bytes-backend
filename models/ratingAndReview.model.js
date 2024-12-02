import mongoose, {Schema} from "mongoose";

const ratingAndReviewsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review : {
        type: String,
        trim: true,
    }
},{timestamps: true})

export const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewsSchema)