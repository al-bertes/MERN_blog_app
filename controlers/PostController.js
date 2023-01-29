import Post from "../models/Post.js";
import { postCreateValidation } from "../utils/validation.js";

export const createPost = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(','),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ СОЗДАТЬ СТАТЬЮ =(",
    });
  }
};
// app.post("/posts", checkAuth, postCreateValidation, PostController.createPost);
export const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts.map(item => item.tags)
                      .flat()
                      .slice(0, 5)
    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ =(",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ =(",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Не удалось загрузить статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    ).populate('user');
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ =(",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    Post.findOneAndRemove(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Не удалось удалить статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ =(",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "НЕ УДАЛОСЬ ОТРЕДАКТИРОВАТЬ СТАТЬЮ =(",
    });
  }
};
