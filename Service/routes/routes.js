const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

// Get environment
require('dotenv').config();
const ENV = process.env;

// Multer setup (used to upload files to the server)
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5000000 }, // 5MB
  dest: './uploads'
});

const API = require('../api/api');

// Wrapper function to use global error handler
const USE = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

ROUTER.post(
  '/auth',
  USE(API.createAuthToken)
);

ROUTER.get(
  '/version',
  USE(API.verifyAuthToken),
  USE(API.version)
);

// User post endpoints

if (ENV.NODE_ENV === 'dev') {
  ROUTER.post(
    '/userpost',
    USE(API.verifyAuthToken),
    USE(API.createUserPost)
  );

  ROUTER.patch(
    '/userpost/:id',
    USE(API.verifyAuthToken),
    USE(API.updateUserPost)
  );

  ROUTER.delete(
    '/userpost/:ak',
    USE(API.verifyAuthToken),
    USE(API.deleteUserPost)
  );
}

ROUTER.get(
  '/userpost/:id',
  USE(API.verifyAuthToken),
  USE(API.getUserPost)
);

ROUTER.post(
  '/userposts',
  USE(API.verifyAuthToken),
  USE(API.getUserPosts)
);

// User endpoints

if (ENV.NODE_ENV === 'dev') {
  ROUTER.post(
    '/user',
    USE(API.verifyAuthToken),
    USE(API.createUser)
  );

  ROUTER.delete(
    '/user/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteUser)
  );

  ROUTER.get(
    '/user/:id',
    USE(API.verifyAuthToken),
    USE(API.getUser)
  );
}

// Image endpoints

if (ENV.NODE_ENV === 'dev') {
  ROUTER.post(
    '/image',
    USE(API.verifyAuthToken),
    USE(upload.single('image')),
    USE(API.createImage)
  );

  ROUTER.get(
    '/image/:id',
    USE(API.verifyAuthToken),
    USE(API.getImage)
  );

  ROUTER.get(
    '/imageurl/:id',
    USE(API.verifyAuthToken),
    USE(API.getImageUrl)
  );

  ROUTER.delete(
    '/image/:id',
    USE(API.verifyAuthToken),
    USE(API.deleteImage)
  );
}

ROUTER.post(
  '/post',
  USE(API.verifyAuthToken),
  USE(upload.array('images', 2)),
  USE(API.createPost)
);

module.exports = ROUTER;
