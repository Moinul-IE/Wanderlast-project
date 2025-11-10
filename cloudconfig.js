// this is for cloud configuration with backend how to connect to cloudinary
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// quick sanity check (do not log secrets)
if (!process.env.CLOUD_NAME) {
    console.warn('[cloudconfig] CLOUD_NAME is not set - Cloudinary uploads will fail');
} else {
    console.log('[cloudconfig] CLOUD_NAME present: ' + process.env.CLOUD_NAME);
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust",
        // cloudinary expects allowed_formats (underscore); ensure correct key
        allowed_formats: ["jpg", "png", "jpeg"]
    },
});

module.exports = {
    cloudinary, 
    storage,
}

// this need to reuire listing.js router where we want to use it