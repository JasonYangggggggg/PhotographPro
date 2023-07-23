const express = require('express');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
app.use(session({secret:'valid'}))
const photograph = require('./models/photograph');
const User = require('./models/user');
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost:27017/personal-project', {useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{

    console.log("mongo connection success")
})
.catch(err=>{
    console.log("error, you are doom")
    console.log(err)
})


//register page
app.get('/register',(req,res)=>{

 res.render('photographPage/register')
})

app.post('/register', async(req,res)=>{
   const {password, username} = req.body;
   const hash = await bcrypt.hash(password,12);
   const user = new User({
    username,
    password:hash
   })
   await user.save();
   req.session.user_id = user._id;
   res.redirect('/photographs')

})



//login page
app.get('/login',(req,res)=>{

    res.render('photographPage/login')
})

app.post('/login', async(req,res)=>{

    const {username,password} = req.body;
    const user = await User.findOne({username});
    const Valid = await bcrypt.compare(password,user.password);
    if(Valid){
        req.session.user_id = user._id;
        res.redirect('/photographs')
    }
    else{
        res.send("You are wrong")
    }

})
app.post('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})



//main page if login

app.get('/photographs',async (req,res)=>{
    if(!req.session.user_id){
      return res.redirect('/login')
    }
    const photographs = await photograph.find({})
    res.render(`photographPage/Allphoto`,{photographs})
    console.log(photographs)
   
})
app.get('/photographs/new', (req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }
res.render('photographPage/new')

})

app.post('/photographs',async(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }

    const newPhoto = new photograph(req.body);
    await newPhoto.save();
    res.redirect(`/photographs/${newPhoto._id}`)
})

app.get('/photographs/:id',async(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }
    const {id} = req.params;
    const photographs = await photograph.findById(id)
    console.log(photographs);
    res.render('photographPage/detail',{photographs})
})

app.get('/photographs/:id/edit',async(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }
    const {id} = req.params;
    const photographs = await photograph.findById(id);
    res.render('photographPage/edit',{photographs})
})
app.put('/photographs/:id', async(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }
   const {id} = req.params;
   const photograpghs = await photograph.findByIdAndUpdate(id,req.body, {runValidators:true,new:true});
   res.redirect(`/photographs/${photograpghs._id}`)
})
app.delete('/photographs/:id',async(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
      }
       const {id} = req.params;
       const deletePhotograph = await photograph.findByIdAndDelete(id);
       res.redirect('/photographs');

})
app.listen(3000,()=>{
    console.log("The application is running on port 3000")
})