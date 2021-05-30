const express = require("express");
const userRouter=express.Router();

const path = require("path");
const { signup, login,getMeetingParticipants} = require("../Controller/userController");

userRouter.post('/register',signup);
userRouter.post('/loginuser',login);
userRouter.post('/getParticipant',getMeetingParticipants);

module.exports=userRouter;