const multer = require("multer");
const path = require("path");
const fs = require("fs");

class FileUploader {
    constructor({ folderName = "public/uploads", supportedFiles = ["image/png", "image/jpg", "image/jpeg", "image/webp", "application/pdf"], fieldSize = 1024 * 1024 * 2 }) {
        this.folderName = folderName;
        this.supportedFiles = supportedFiles;
        this.fieldSize = fieldSize;

        // Check if the folder exists, if not, create it
        if (!fs.existsSync(this.folderName)) {
            fs.mkdirSync(this.folderName, { recursive: true });
        }
    }

    // Set up storage configuration 
    storage() {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.folderName);
            },
            filename: (req, file, cb) => {
                let ext = path.extname(file.originalname);
                cb(null, Date.now() + "SM" + ext);
            },
        });
    }

    // Set up file filter to only accept the supported file types
    fileFilter() {
        return (req, file, callback) => {
            if (this.supportedFiles.includes(file.mimetype)) {
                callback(null, true);
            } else {
                console.log(`Please select a valid file format. Supported formats are: ${this.supportedFiles.join(", ")}`);
                callback(null, false);
            }
        };
    }

    // Return the multer configuration with dynamic options
    upload() {
        return multer({
            storage: this.storage(),
            fileFilter: this.fileFilter(),
            limits: {
                fileSize: this.fieldSize,
            },
        });
    }
}

module.exports = FileUploader;
