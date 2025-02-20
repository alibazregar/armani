import multer from "multer";
import path from "path";
import fs from "fs";
import { RequestHandler } from "express";
import crypto from "crypto";
function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString("hex");
}
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const uploadDir = "./public/userUploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (_, file, cb) {
    cb(
      null,
      file.fieldname +
        "_" +
        generateRandomString(7) +
        new Date().toISOString().replace(/:/g, "-") +
        path.extname(file.originalname) 
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 mb
  fileFilter: function (_, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|tiff|tif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      //@ts-ignore
      cb(new multer.MulterError("INVALID_FILE_TYPE"));
    }
  },
}).fields([
  {
    name: "files",
    maxCount: 10,
  },
  {
    name: "cover",
    maxCount: 1,
  },
]);

const uploadFile: RequestHandler = (req, res, next) => {
  upload(req, res, (err): any => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({ message: "the file is too large" });
      }
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).send({
          message:
            "invalid file type ; the file should be jpg jpeg png tif tiff or pdf",
        });
      }
      console.log("uploadErr:" + err.stack);
      return res
        .status(400)
        .send({ message: "unexpected upload error; try again later" });
    }
    if (!req.files || req.files.length == 0) {
      return res
        .status(400)
        .send({ message: "you should upload at least one file" });
    }
    next();
  });
};
export default uploadFile;
