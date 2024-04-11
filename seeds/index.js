const mongoose = require('mongoose');
const users = require('../models/user');

mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://localhost:27017/user',{
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
    
});

const seedDB = async () => {
    await users.deleteMany({});
    const us = new users({
        fullName: 'Manav Singh',
        need: '20000',
        tenure:'16',
        empStatus: 'Employed',
        reason: 'Home loan',
        address:'India',
        loan_status:{
            stat:'Pending'
        }

    });
    await us.save();
};

seedDB();