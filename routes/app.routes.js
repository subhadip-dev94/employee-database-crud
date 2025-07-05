const route = require('express').Router();
const appController = require("../controllers/app.controller")
const FileUploader = require('../helper/fileUpload');

const fileUpload = new FileUploader({
    folderName: "public/uploads", supportedFiles: ["image/png", "image/jpg", "image/jpeg", "image/webp", "application/pdf"], fieldSize: 1024 * 1024 * 5
});

const uploadFields = fileUpload.upload().fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumePdf', maxCount: 1 }
]);

route.get('/', appController.getForm);
route.post('/submit-form', uploadFields, appController.submitForm);
route.get('/list', appController.getList);
route.get('/delete/:id', appController.deleteEmp);
//route.get('/permanent-delete/:id', appController.permanentDeleteEmp);
route.get('/edit/:id', appController.getEditForm);
route.post('/update-form/:id', uploadFields, appController.updateEmp);


module.exports = route;