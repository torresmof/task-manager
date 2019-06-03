const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");



const router = new express.Router();

router.post("/users", async (req,res) =>{ // crate of crud
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user,token });
    }catch(e){
        res.status(404).send("An error occured ")
    }
});

router.post("/users/login", async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token });
    }catch(e){
        res.status(400).send();
    }
});

router.post("/users/logout",auth, async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

router.post("/users/logoutall",auth, async (req,res) =>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});



router.get("/users/me", auth , async (req,res) =>{ // read of crud
    res.send(req.user);
    
})

router.delete("/users/me", auth, async(req,res) =>{
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

const upload = multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return callback(new Error("Please upload a image"));
        }
        callback(undefined,true);
    }
});

router.delete("users/me/avatar",auth,async(req,res) =>{
    req.user.avatar = undefined;
    res.send().status(200);
});

router.post("/users/me/avatar",auth, upload.single("avatar"), async (req,res) =>{
    const buffer = await sharp(req.file.buffer).resize( {width:250,height:250} ).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error,req,res,next) =>{
    if(error) return res.status(400).send({error:error.menssage})
});

router.get("/users/:id/avatar",async(req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) throw new Error();

        res.set("Content-Type","image/png");
        res.send(user.avatar);

        

    }catch(e){
        res.status(404).send();
    }
});




router.patch("/users/me",auth, async (req,res) =>{
    const updates = Object.keys(req.body);
    const allowed = ["name","email","password" ,"age"];
    
    const isValidOperation = updates.every(update => allowed.includes(update));

    if(!isValidOperation) return res.status(400).send({error:"Invalid updates"});

    try{
        updates.forEach(update => req.user[update] = req.body[update]);

        await req.user.save();  
        res.send(req.user);

        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        if(!req.user) return res.status(404).send();

        res.status(201).send(req.user);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
});

module.exports = router;
