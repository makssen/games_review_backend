const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploader = async(path) => {
    const { url, public_id } = await cloudinary.uploader.upload(path, null, { folder: 'posts' });
    return url;
}

module.exports = {
    uploader,
    cloudinary
};