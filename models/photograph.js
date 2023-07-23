const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PhotographSchema = new Schema({
    
    Location:String,
    description:String,
    image:String,
    category:{
        type:String,
        enum:['technology','vision','universe']},

    author:String
});


module.exports = mongoose.model('Photograph',PhotographSchema);