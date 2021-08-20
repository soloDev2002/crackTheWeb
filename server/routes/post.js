import Post from "../models/post.js";
import { Router } from "express";

//initialising router
const router = Router();

//add blog

router.route("/addBlog").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const editor = req.body.editor;
  const createdBy = req.body.createdBy;
  const blog = new Post({
    title: title,
    description: description,
    editor: editor,
    createdBy: createdBy,
  });

  Post.create(blog)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

//get all blog

router.route("/getAllBlogs").get((req, res) => {
  Post.find()
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

//get blog by title

router.route("/getBlog/:title").get((req, res) => {
  const title = req.params.title;

  Post.find({ title: title })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

//edit blog by id

router.route("/updateBlog/:editField").put((req, res) => {
  const fieldName = req.params.editField;
  const fieldDetails = req.body.fieldDetails;
  const id = req.body.id;
  Post.findByIdAndUpdate(id, {
    [fieldName]: fieldDetails,
  })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

//delete blog by id

router.route("/deleteBlog").delete((req, res) => {
  const id = req.body.id;
  Post.findByIdAndDelete(id)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

export default router;
