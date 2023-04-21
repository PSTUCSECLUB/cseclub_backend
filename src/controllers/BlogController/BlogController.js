const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const Blog = require("../../models/BlogModel/BlogModel");
const { getPublicId, removeImageFromCloud } = require("../../utils/cloud");
const APIFeatures = require("../../utils/ApiFeatures");

exports.createBlog = catchAsyncErrors(async (req, res, next) => {
  const { title, category, tags, description } = req.body;
  try {
    const blog = new Blog({
      title,
      author: req.user._id,
      category,
      tags,
      coverImg: req.files?.coverImg[0]?.path,
      thumbnail: req.files?.thumbnail[0]?.path,
      description,
    });

    const result = await blog.save();

    res.status(201).json({
      result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.allBlog = catchAsyncErrors(async (req, res, next) => {
  const blogCount = await Blog.countDocuments();
  const apiFeatures = new APIFeatures(Blog.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const allBlogs = await apiFeatures.query;

  res.status(200).json({
    success: true,
    blogs: allBlogs,
    blogCount,
  });
});

exports.singleBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    const singleBlog = await Blog.findById(req.params.blogId).lean();
    if (!singleBlog) {
      return next(new ErrorHandler("Blog not found", 404));
    }
    res.status(200).json({
      success: true,
      singleBlog,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//! json data
exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    if (blog.author.toString() === req.user._id.toString()) {
      try {
        blog = await Blog.findByIdAndUpdate(
          req.params.blogId,
          {
            $set: req.body,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          success: true,
          blog,
        });
      } catch (error) {
        res.status(500).json(err);
      }
    } else {
      return next(new ErrorHandler("You can update only your post!", 401));
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.removeBlog = catchAsyncErrors(async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    const thumbnailId = getPublicId(blog.thumbnail);
    const coverImgId = getPublicId(blog.coverImg);

    if (blog.author.toString() === req.user._id.toString()) {
      try {
        removeImageFromCloud(thumbnailId);
        removeImageFromCloud(coverImgId);

        await Blog.findByIdAndRemove(req.params.blogId);

        res.status(200).json({
          success: true,
          message: "Blog deleted successfully",
        });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      return next(new ErrorHandler("You can Delete only your post!", 401));
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.updateBlogCover = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let blog = await Blog.findById(req.params.blogId);

      if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
      }

      if (blog.author.toString() === req.user._id.toString()) {
        const coverImgId = getPublicId(blog.coverImg);
        removeImageFromCloud(coverImgId);

        const updateCoverImageUrl = {
          coverImg: req.files?.coverImg[0]?.path,
        };

        blog = await Blog.findByIdAndUpdate(
          req.params.blogId,
          updateCoverImageUrl,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );

        res.status(200).json({
          success: true,
          blog,
        });
      } else {
        return next(new ErrorHandler("You can update only your post!", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.updateBlogThumbline = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;
    console.log(file);

    if (file !== "") {
      let blog = await Blog.findById(req.params.blogId);

      if (!blog) {
        return next(new ErrorHandler("Blog not found", 404));
      }

      if (blog.author.toString() === req.user._id.toString()) {
        const thumbnailId = getPublicId(blog.thumbnail);
        removeImageFromCloud(thumbnailId);

        const updateThumbnailImageUrl = {
          thumbnail: req.files?.thumbnail[0]?.path,
        };

        blog = await Blog.findByIdAndUpdate(
          req.params.blogId,
          updateThumbnailImageUrl,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );

        res.status(200).json({
          success: true,
          blog,
        });
      } else {
        return next(new ErrorHandler("You can update only your post!", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
