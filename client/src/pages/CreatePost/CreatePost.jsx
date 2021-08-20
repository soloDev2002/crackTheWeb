import { EditorState, convertToRaw } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import Storage from "../../firebase";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "../../axios.js";
import "./createPost.css";

function CreatePost() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [editor, setEditor] = useState(() => EditorState.createEmpty());
  const [files, setFiles] = useState([]);
  let imagesUrl = [];

  useEffect(() => {
    console.log(convertToRaw(editor?.getCurrentContent()).entityMap);
  }, [editor]);

  //image callback
  function imageCallback(file) {
    setFiles((prevState) => [
      ...prevState,
      { file: file, localLink: URL.createObjectURL(file) },
    ]);
    return new Promise((resolve, reject) => {
      resolve({ data: { link: URL.createObjectURL(file) } });
    });
  }

  //handling image upload in firebase
  async function handleDataUpload() {
    console.log(files, title);

    //checking the final images from the editor

    const finalImages = convertToRaw(editor?.getCurrentContent()).entityMap;
    console.log("finalImages", finalImages);

    for (let img in finalImages) {
      let blob = (await fetch(finalImages[img].data.src)).console.log(blob);
    }

    // let finalFiles = [];
    // files.map((file) => {
    //   console.log(file.localLink);
    //   for (const img in finalImages) {
    //     console.log(finalImages[img].data.src);
    //     if (file.localLink === finalImages[img].data.src) {
    //       finalFiles.push(file);
    //     }
    //   }
    // });

    // console.log(finalFiles);

    //uploading images in firebase
    if (title) {
      if (files.length > 0) {
        console.log("files", files);
        const storageRef = Storage.ref(`${title}`);

        files.map((file, index) => {
          const imgRef = storageRef.child(`/${file.file.name}`);
          imgRef.put(file.file).then(() => {
            imgRef
              .getDownloadURL()
              .then((res) => {
                imagesUrl.push(res);
                if (index === files.length - 1) {
                  handleUploadInDb();
                }
              })
              .catch((err) => console.log(err));
          });
        });
      } else {
        console.log("entering");
        handleUploadInDb();
      }
    }
  }

  //push details in a variable
  function handleUploadInDb() {
    let imgIndex = 0;
    let editData = [];
    const allDetails = convertToRaw(editor?.getCurrentContent()).blocks;
    const nonBlankDetails = allDetails.filter((detail) => detail.text !== "");

    nonBlankDetails.map((detail, index) => {
      let text = detail.text;
      let styles = detail.inlineStyleRanges;
      let key = detail.key;
      let type = detail.type;
      console.log("index", index);
      console.log("nonBlankDetails.length-1", nonBlankDetails.length - 1);
      if (type !== "atomic" && text.length > 0) {
        editData.push({
          text: text,
          styles: styles,
          key: key,
        });
        if (index === nonBlankDetails.length - 1) {
          handleAxiosUpload(editData);
        }
      } else if (type === "atomic" && files[imgIndex]) {
        editData.push({
          imageName: files[imgIndex].file.name,
          imageLink: imagesUrl[imgIndex],
          key: key,
        });
        imgIndex = imgIndex + 1;
        if (index === nonBlankDetails.length - 1) {
          handleAxiosUpload(editData);
        }
      }
    });

    //using axios to make the final push
    function handleAxiosUpload(editorialData) {
      console.log("entered axios");
      axios
        .post("/addBlog", {
          title: title,
          description: description,
          editor: editorialData,
          createdBy: "ninja",
        })
        .then((res) => {
          setTitle("");
          setEditor("");
          setDescription("");
          imagesUrl.length = 0;
          editData.length = 0;
          setFiles([]);
          console.log("res.data", res.data);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="create__post__container">
      <div className="post__title">
        <div className="label">Title</div>
        <textarea
          className="title__textarea"
          value={title}
          onChange={(e) =>
            e.target.value.length < 150
              ? setTitle(e.target.value)
              : alert("Title cannot have more than 150 characters")
          }
        />
      </div>
      <div className="post__description">
        <div className="label">Description</div>
        <textarea
          className="description__textarea"
          value={description}
          onChange={(e) =>
            e.target.value.length < 600
              ? setDescription(e.target.value)
              : alert("Description cannot have more than 600 characters")
          }
        />
      </div>
      <div className="post__body">
        <div className="label">Body</div>
        <div className="body__textarea">
          <Editor
            editorState={editor}
            onEditorStateChange={setEditor}
            onChange={(e) => console.log(e)}
            toolbar={{
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: imageCallback,
              },
            }}
          />
        </div>
      </div>
      <button onClick={handleDataUpload}>submit</button>
    </div>
  );
}

export default CreatePost;
