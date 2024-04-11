const express = require('express');
const path = require('path');
const http = require("http");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const user = require('./models/user');


const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'views')));



mongoose
    .connect('mongodb://localhost:27017/user')
    .then(() => {
        console.log("Database Connected");
    })
    .catch(() => {
        console.log("error occurred while connecting to MongoDB database in the example file");
    });



app.get('/',(req,res)=>{
    res.render('home')
});

app.get('/new_loan',(req,res)=>{
    res.render('new')
});

app.post('/upload_loan',async(req,res)=>{
    req.body.user.loan_status = { stat: 'pending' };
    const us = new user(req.body.user);
    console.log(req.body)
    await us.save();
    res.redirect('/')
});

app.get('/get_dash' ,async(req,res)=>{
    const us =await user.find({}) 
    const cnt = await user.countDocuments({});
    const approvedUsers =await user.find({ 'loan_status.stat': 'approved' });
    const approvedCount=await user.countDocuments({'loan_status.stat': 'approved' });
    let totalLoan=0;
    approvedUsers.forEach(user=>{
        totalLoan+=user.need;
    });
    
    console.log(us);
    res.render('dashboard_admin',{cnt,us,totalLoan,approvedCount})
})


app.post('/updateStatus', async (req, res) => {
    const userId = req.body.userId;
    const newStatus = req.body.status;

    try {
        const updatedUser = await user.findByIdAndUpdate(userId, { 'loan_status.stat': newStatus });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/get_dashVerify');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating status');
    }
});



app.get('/show_user/:id', async(req,res)=>{
    const u = await user.findById(req.params.id);
    const names = await user.find({'fullName':u.fullName})
    
    
    res.render('dashboard_user',{u , names})
})

app.get('/get_dashVerify',async(req,res)=>{
    const us =await user.find({}) 
    const cnt = await user.countDocuments({});
    const approvedUsers =await user.find({ 'loan_status.stat': 'approved' });
    const approvedCount=await user.countDocuments({'loan_status.stat': 'approved' });
    let totalLoan=0;
    approvedUsers.forEach(user=>{
        totalLoan+=user.need;
    });
    
    console.log(us);
    res.render('dashboard_verify',{cnt,us,totalLoan,approvedCount})


    
})







app.listen(3000, () => {
    console.log('Serving on port 3000');
});