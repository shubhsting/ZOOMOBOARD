let userModel = require("../Model/userModel");
var cookies=require('cookie-parser');
const meetingModel = require("../Model/meetingModel");
//login


async function login(req, res) {
    try{
    let {email,password}=req.body;
    let user=await userModel.findOne({
        email:email
    });

    if(!user){
        return res.status(400).send("User Not registered!!")
    }
    if(user.password!=password){
        return res.status(400).send("Password is incorrect!")
    }
    res.cookie('email',email);

    // res.redirect('/board');
    
    res.status(200).send("login successfull");
    
    }
    catch(e){
        console.log(e);
        res.status(400).send(e);
    }
}

async function getMeetingParticipants(req,res){
    try{
    let {meetingId}=req.body;
        console.log(meetingId);
    let dbparticipants=  await meetingModel.findOne({
        meetingID:meetingId
    });

    if(!dbparticipants){
        return res.status(400).send("Not found");
    }
    res.status(200).send(dbparticipants.participants);

    }
    catch(e){
        res.status(400).send(e);
    }
}

//signup
async function signup(req, res) {
    try {
        let {username,email,password} = req.body;
        let user=await userModel.findOne({
            email:email
        });
        if(user){
            return res.status(400).send("User Already registered!")
        }
        let userM = await userModel.create({name:username,email:email,password:password});
        res.status(200).send({ message: 'User Added', data: userM })
    }
    catch (e) {
        res.status(500).send({ error: e })
    }
}

module.exports = { login, signup ,getMeetingParticipants}