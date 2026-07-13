const cloudinary = require("../config/cloudinary");

// Upload a single buffer to Cloudinary
const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `auction-house/${folder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

const uploadMultiple = async (files, folder) => {
  const uploads = files.map((file) => uploadBuffer(file.buffer, folder));
  return Promise.all(uploads);
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error.message);
  }
};

module.exports = { uploadBuffer, uploadMultiple, deleteImage };
