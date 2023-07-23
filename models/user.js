const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
         
    username:{

        type:String,
        required:[true,'username must fill']
    },

    password:{
        type:String,
        required:[true,'password must fill']
    }


})


module.exports = mongoose.model('User',userSchema);