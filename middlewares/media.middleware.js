const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};

const memeImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/memeImage");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let uploadMemeImage = multer({ storage: memeImage, fileFilter, limits: {
  fileSize: 1024 * 1024 * 100,
}, });

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString(16) + "-" + file.originalname + ".mp3");
  },
});

const uploadAudioFile = multer({
  preservePath: true,
  storage: audioStorage,
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadVideoFile = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-matroska"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/files/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  }
});

const allowedFiles = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|mp4|mkv)$/)) {
    req.fileValidationError = 'type not allowed!';
    return cb(new Error('type not allowed!'), false);
  }
  cb(null, true);
};

const uploadFile = multer({
  storage: fileStorage,
  fileFilter: allowedFiles  // Pass the allowedFiles function as the fileFilter option
});

module.exports = { uploadMemeImage, uploadAudioFile, uploadVideoFile, uploadFile};
