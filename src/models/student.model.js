const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName : {type:String,required:true},
    middleName : {type:String},
    lastName : {type:String,required:true},
    email:{type:String},
    phoneNumber : {type:Number,required:true},
    dateOfBirth:{type:Date},
    gender:{type:String},
    maritalStatus:{type:String},
    courseInterested : {type:String,required:true},
    followUpDate : {type:Date,required:true},
    englishExamType:{type:String},
    examDate:{type:Date},
    overall:{type:String},
    listening:{type:String},
    reading:{type:String},
    writing:{type:String},
    speaking:{type:String},
    lastUpdateUser : {type:String,required:true},
    followUpRemarks : {type:Array},
    status:{type:String,required:true,default:'P'},
},{
    timestamps:true
});

const Student = mongoose.model('Student',studentSchema);

module.exports = Student;