import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  createdAT: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
    trim: true,
    required: true,
  },
  editor: [
    {
      imageName: { type: String, trim: true },
      imageLink: { type: String },
      text: { type: String, trim: true },
      styles: {
        type: Array,
      },
      key: {
        type: String,
        required: true,
      },
    },
  ],
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
