const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const courseSchema = new Schema({
    courseName : { type:String, required: true},
    country : { type:String, required: true},
    description : { type:String, required: false},
    university : { type:String, required: true},
    duration : {type:String, required:true}
},{
    timestamps:true,
});
const Course = mongoose.model('Course',courseSchema);

module.exports = Course;
