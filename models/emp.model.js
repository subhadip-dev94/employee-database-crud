const mongoose = require('mongoose');

const EmpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true           
    },
    namePrefix: {
        type: String,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    pf:{
        type: Number,
        required: true
    },
    esic:{
        type: Number,
        required: true  
    },
    totalSalary: {
        type: Number,
        required: true
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true,
    versionKey: false
})


const EmpModel = new mongoose.model('newEmployee', EmpSchema);

module.exports = EmpModel;


