import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {hendleValidationErrors, checkAuth} from "./middlewares/index.js";
import cors from 'cors'
import {
  registerValidator,
  loginValidation,
  postCreateValidation,
} from "./utils/validation.js";
import {PostController, UserController} from  "./controlers/index.js"
 
mongoose
  .connect(
    "mongodb+srv://albert:rjvgenth@cluster0.ajn7nse.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(console.log("DB ok"))
  .catch((err) => console.log("DB no good", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const app = express();

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, hendleValidationErrors, UserController.login);
app.post(
  "/auth/register",
  registerValidator,
  hendleValidationErrors,
 UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get('/tags', PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get('posts/tags', PostController.getLastTags);
app.post("/posts", checkAuth, postCreateValidation, PostController.createPost);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, hendleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
