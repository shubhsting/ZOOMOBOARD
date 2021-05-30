const express = require("express");
const viewRouter=express.Router();

const path = require("path");
const { showBoard, showlogin, showSignup,showJoinMeet,showstartMeeting } = require("../Controller/viewController");



viewRouter.get('/board',showBoard);
viewRouter.get('/',showlogin);
viewRouter.get('/login',showlogin);
viewRouter.get('/signup',showSignup);
viewRouter.get("/joinmeet",showJoinMeet);
viewRouter.get('/startmeet',showstartMeeting);


module.exports=viewRouter;