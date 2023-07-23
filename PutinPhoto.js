const express = require('express');
const mongoose = require('mongoose');
const photograph = require('./models/photograph');
mongoose.connect('mongodb://localhost:27017/personal-project', {useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{

    console.log("mongo connection success")
})
.catch(err=>{
    console.log("error, you are doom")
    console.log(err)
})


const photographGroup = [
    {
            Location:'Chicago',
            description:'beauty',
             category:'technology',
             author:'Jason'
    },
    {
             Location:'new-york',
             description:'goodgood good',
             category:'vision',
             author:'MrJ'
    },
    {
             Location:'queen-city',
             description:'Its vert beautiful',
             category:'universe',
             author:'Viper'
    },
]

photograph.insertMany(photographGroup)
.then(res=>{
    console.log(res)
})
.catch(e=>{
    console.log(e)
})