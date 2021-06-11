const path = require("path");
const meetingModel = require("../Model/meetingModel");

const userModel = require("../Model/userModel");

async function showBoard(req, res) {
    try {
        // let user=await userModel.create({name:'opopo',email:'opopopooop'})
        let email = req.cookies.email;

        let meetingId=req.cookies.meeting;
        if(!meetingId){
            if(email){
                let user=await userModel.findOne({
                    email:email
                });
                res.render('joinmeet.pug',{name:user.name});
            }
            else{
                res.render('login.pug');
            }
            return;
        }
        let meeting=await meetingModel.findOne({
            meetingID:meetingId
        })
        let user=await userModel.findOne({
            email:email
        });

        if (!email ||!user) {
            res.render('login.pug');
        }
        else if(!meetingId){
            res.render('joinmeet.pug',{name:user.name});
        }
        else {
            res.render("master.pug",{meetingId:req.cookies.meeting});
        }
    }
    catch (e) {
        console.log("error yha haai", e);
    }
}

async function showlogin(req, res) {
    res.render('login.pug');
}

async function showSignup(req, res) {
    res.render("signup.pug");
}
async function showJoinMeet(req,res){
    let email = req.cookies.email;
    if (!email) {
        res.render('login.pug');
    }
    else {
        let user=await userModel.findOne({
            email:email
        });
        res.render("joinmeet.pug", { name: user.name });
    }
}
async function showstartMeeting(req,res){
    let email = req.cookies.email;
    if (!email) {
        res.render('login.pug');
    }
    else {
        let user=await userModel.findOne({
            email:email
        });
        res.render("startmeet.pug", { name: user.name });
    }
}
module.exports = {
    showBoard,
    showlogin,
    showSignup,
    showJoinMeet,
    showstartMeeting
}