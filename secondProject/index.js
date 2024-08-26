const express=require("express")
const users=require("./Users.json")
const fs=require("fs")


const app=express()
const PORT=8000
app.use(express.urlencoded({extended:false}))

app.get('/users',(req,res)=>{
    res.json(users)
})

app.get('/users/:id',(req,res)=>{
    const id=Number(req.params.id)
    const singleUser=users.find((user)=>{
       return user.id===id
    })
    res.json(singleUser)
})

app.post('/users/createUser',(req,res)=>{
    const body=req.body;
    users.push({...body,id:users.length+1})
    fs.writeFile("./Users.json",JSON.stringify(users),(err,data)=>{
        res.send("user is successfully created")
    })
})
app.listen(PORT,()=>{
    console.log(`server is listening at : http://localhost:${PORT}`)
})
