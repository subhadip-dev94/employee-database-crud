const EmpModel = require("../models/emp.model")

class AppController {

    async getForm(req, res) {
        try {
            res.render('form', {
                title: "Form"
            })
        } catch (err) {
            throw err;
        }
    }

    async submitForm(req, res) {
        try {
            console.log(req.body);
            console.log(req.file, "REQ FILE");

            // Determine name prefix Mr or Miss based on gender code
            if (req.body.gender === "male") {
                req.body.namePrefix = "Mr.";
            } else if (req.body.gender === "female") {
                req.body.namePrefix = "Ms.";
            } else {
                req.body.namePrefix = "Mx.";
            }

            req.body.pf = (req.body.basicSalary * 12) / 100;                       
            
            if (req.body.basicSalary > 21000) {
                req.body.esic = 0; 
            } else{
                req.body.esic = (req.body.basicSalary * 4) / 100;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                console.log("Invalid email format.");
                return res.redirect("/");
            }
            // no duplicate email check
            const existingEmail = await EmpModel.find({ email: req.body.email, isDeleted: false });
            if (existingEmail.length > 0) {
                console.log("Email already exists.");
                return res.redirect("/");
            }
            // Validate phone number format (assuming it should be a 10-digit number)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(req.body.phone)) {
                console.log("Phone number must be a 10-digit number.");
                return res.redirect("/");
            }
            // Check for duplicate phone number
            const existingPhone = await EmpModel.find({ phone: req.body.phone, isDeleted: false });
            if (existingPhone.length > 0) {
                console.log("Phone number already exists.");
                return res.redirect("/");
            }

            // Calculate total salary
            req.body.totalSalary = req.body.basicSalary - req.body.pf - req.body.esic;

            
            let profileImage = "";
            let resumePdf = "";
            if (req.files) {
                if (req.files.profileImage && req.files.profileImage[0]) {
                    profileImage = req.files.profileImage[0].filename;
                }
                if (req.files.resumePdf && req.files.resumePdf[0]) {
                    // Check if uploaded file is a PDF
                    if (req.files.resumePdf[0].mimetype !== "application/pdf") {
                        console.log("Resume must be a PDF file.");
                        return res.redirect("/");
                    }
                    resumePdf = req.files.resumePdf[0].filename;
                }
            }

            let userObj = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                profileImage: profileImage,
                resumePdf: resumePdf,
                phone: req.body.phone,
                gender: req.body.gender,
                namePrefix: req.body.namePrefix,
                basicSalary: req.body.basicSalary,
                pf: req.body.pf,
                esic: req.body.esic,
                totalSalary: req.body.totalSalary,
                isDeleted: false    
            };

            req.body = userObj;
            console.log(req.body, "req.bodyreq.bodyreq.body");

            const saveData = await EmpModel.create(req.body);

            console.log(saveData, "saveData...");
            res.redirect("/");

        } catch (err) {
            console.log(err);
            return res.redirect("/");
        }
    }


    async getList(req, res) {
        try {
            let allData = await EmpModel.find({ isDeleted: false }).sort({ firstName: 1 });
            res.render('list', {
                title: "List",
                allData
            });
            console.log(allData, "allDataallDataallData");
            

        } catch (err) {
            throw err;
        }
    }

    async getEditForm(req, res) {
        try {
            let empId = req.params.id;
            let empData = await EmpModel.findById(empId);
            res.render('edit', {
                title: "Edit Form",
                empData
            });
        } catch (err) {
            throw err;
        }
    }
    async updateEmp(req, res) {
        try {
            let empId = req.params.id;

            
            const gender = (req.body.gender || "").trim().toLowerCase();
            if (gender === "male") {
                req.body.namePrefix = "Mr.";
            } else if (gender === "female") {
                req.body.namePrefix = "Ms.";
            } else {
                req.body.namePrefix = "Mx.";
            }

            // Ensure basicSalary is a number
            req.body.basicSalary = Number(req.body.basicSalary);

            // Update pf and esic based on basicSalary
            req.body.pf = (req.body.basicSalary * 12) / 100;
            if (req.body.basicSalary > 21000) {
                req.body.esic = 0;
            } else {
                req.body.esic = (req.body.basicSalary * 4) / 100;
            }
            // Update totalSalary
            req.body.totalSalary = req.body.basicSalary - req.body.pf - req.body.esic;

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                console.log("Invalid email format.");
                return res.redirect(`/edit/${empId}`);
            }
            // Check for duplicate email (excluding current employee)
            const existingEmail = await EmpModel.findOne({ email: req.body.email, isDeleted: false, _id: { $ne: empId } });
            if (existingEmail) {
                console.log("Email already exists.");
                return res.redirect(`/edit/${empId}`);
            }
            // Validate phone number format (assuming it should be a 10-digit number)
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(req.body.phone)) {
                console.log("Phone number must be a 10-digit number.");
                return res.redirect(`/edit/${empId}`);
            }
            // Check for duplicate phone number (excluding current employee)
            const existingPhone = await EmpModel.findOne({ phone: req.body.phone, isDeleted: false, _id: { $ne: empId } });
            if (existingPhone) {
                console.log("Phone number already exists.");
                return res.redirect(`/edit/${empId}`);
            }

            // Handle profile image and resume PDF update
            if (req.files) {
                if (req.files.profileImage && req.files.profileImage[0]) {
                    req.body.profileImage = req.files.profileImage[0].filename;
                }
                if (req.files.resumePdf && req.files.resumePdf[0]) {
                    if (req.files.resumePdf[0].mimetype !== "application/pdf") {
                        console.log("Resume must be a PDF file.");
                        return res.redirect(`/edit/${empId}`);
                    }
                    req.body.resumePdf = req.files.resumePdf[0].filename;
                }
            }

            let updatedData = await EmpModel.findByIdAndUpdate(empId, req.body, { new: true });
            console.log(updatedData, "updatedDataupdatedData");
            res.redirect("/list");
        } catch (err) {
            console.log(err);
            return res.redirect(`/edit/${req.params.id}`);
        }
    }

    // soft delete
    async deleteEmp(req, res) {
        try {
            let empId = req.params.id;
            console.log(empId, "empIdempIdempId");
            let deletedData = await EmpModel.findByIdAndUpdate(empId, { isDeleted: true }, { new: true });
            console.log(deletedData, "deletedDatadeletedData");
            res.redirect("/list");
        } catch (err) {
            throw err;
        }
    }
    // permanent delete
    /*async permanentDeleteEmp(req, res) {
        try {
            let empId = req.params.id;
            console.log(empId, "empIdempIdempId");
            let deletedData = await EmpModel.findByIdAndDelete(empId);
            console.log(deletedData, "deletedDatadeletedData");
            res.redirect("/list");
        } catch (err) {
            throw err;
        }
    }*/



}


module.exports = new AppController();