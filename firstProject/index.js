const express = require('express')
const users=require('./MOCK_DATA.json')
const fs=require("fs")
const mongoose = require("mongoose")
const app=express()
const port=3000

//connection

mongoose
.connect('mongodb://127.0.0.1:27017/UsersData')
.then(()=>{
    console.log("Mongodb connected")
})
.catch((err)=>{
    console.log("MongoDb Error ", err)
})


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,
        require:true
    },
    gender:{
        type:String,
    }

},{timestamps:true})

const User=mongoose.model('user',userSchema)

app.use(express.urlencoded({extended:false}))
app.use((req,res,next)=>{
    fs.appendFile('log.txt',`\n${Date.now()}: ${req.method} : ${req.path}\n`,(err,data)=>{
        next()
    })
    
});

app.get('/api/users', async (req,res)=>{
    const allDBusers=await User.find({})
    return res.json(allDBusers)
})

app.get('/users',   async (req,res)=>{
    const allDBUsers = await User.find({});
    const html=`
    <ul>
    ${allDBUsers.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

app.route("/api/users/:id").get(async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
}).patch( async (req,res)=>{
    await User.findByIdAndUpdate(req.params.id,{lastName:"Changed"})
    return res.json({status:"Success"})
}).delete(async(req,res)=>{
        //delete edit with id
        await User.findByIdAndDelete(req.params.id)
        return res.json({status:"success"})
})


app.post("/api/users",  async (req,res)=>{
    const body=req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg:"All fields are req ..."});
    }

    const result = await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title
    })
    console.log(result)
    return res.status(201).json({msg:"success"});

})

app.patch("/api/users/:id",(req,res)=>{
    return res.json({status:"pending"})
})

app.listen(port,()=>{
    console.log(`Servers is listen on : http://localhost:${port}`)
})