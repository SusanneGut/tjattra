const mongoose = require('mongoose');

const messageScheam = new mongoose.Schema({
    content: String,
    name: String,
},{timestams: true,});

module.exports=mongoose.model('Message', messageScheam);