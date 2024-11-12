const multer = require('multer')
const {cloudinary} = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp','avif']
  },
});

const upload = multer({ storage });

module.exports = { upload }
