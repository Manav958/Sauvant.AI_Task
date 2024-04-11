const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    fullName: String,
    need: Number,
    tenure:String,
    empStatus: String,
    reason: String,
    address:String,
    loan_status:{
        stat:String
    }
});

const user = mongoose.model('user', userSchema);

module.exports=user;