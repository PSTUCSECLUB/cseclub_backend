const { cloudinary } = require("../config/cloudinary");

exports.getPublicId = (imageURL) => {
  return imageURL.split("/").pop().split(".")[0];
};

exports.removeImageFromCloud = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};

exports.getPublicIdList = (elt) => {
  imageURLs = [];

  for (let i = 0; i < elt.length; i++) {
    imageURLs.push(elt[i].split("/").pop().split(".")[0]);
  }

  return imageURLs;
};

exports.removeImageFromCloudList = async (public_ids) => {
  for (let i = 0; i < public_ids.length; i++) {
    await cloudinary.uploader.destroy(public_ids[i]);
  }
};
