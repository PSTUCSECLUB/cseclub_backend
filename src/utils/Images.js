const path = require("path");
const fs = require("fs");

// input - imgUrls is an array
// output - void
async function removeMultipleImgs(imgUrls) {
  imgUrls.forEach(async (imgUrl) => {
    await removeSingleImg(imgUrl);
  });
}
// public id shape will be like = f-media-1683438
// input - imgUrl
// output - void
async function removeSingleImg(imgUrl) {
  let publicId = imgUrl.slice(process.env.URL.length + 1);
  const { folder, fileName } = extractImgInfo(publicId);
  const filePath = path.resolve(`uploads/${folder}/${fileName}`);
  console.log(fileName);
  await removeAFile(filePath);
}

// input - public id
// output - an object {folder:name,fileName:fileName}

function extractImgInfo(publicId) {
  // public id shape will be like = f-media-1683438
  let folder = "";
  let fileName = "";
  // extract folder
  let i = 0;
  while (publicId[i] !== "/" && i < publicId.length) {
    folder += publicId[i];
    i++;
  }
  i++;
  while (i < publicId.length) {
    fileName += publicId[i];
    i++;
  }
  return { folder, fileName };
}

async function removeAFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    else console.log("deleted successfully");
  });
}

module.exports = {
  removeMultipleImgs,
  removeSingleImg,
};
