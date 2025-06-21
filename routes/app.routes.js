const route = require('express').Router();
const appController = require("../controllers/app.controller")


route.get('/', appController.getForm);
route.post('/submit-form', appController.submitForm);
route.get('/list', appController.getList);
route.get('/delete/:id', appController.deleteEmp);
//route.get('/permanent-delete/:id', appController.permanentDeleteEmp);
route.get('/edit/:id', appController.getEditForm);
route.post('/update-form/:id', appController.updateEmp);


module.exports = route;