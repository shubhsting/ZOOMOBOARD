const express = require("express");
const meetingRouter=express.Router();

const path = require("path");
const { createMeeting ,joinMeeting,leaveMeeting} = require("../Controller/meetingController");

meetingRouter.post('/newmeet',createMeeting);
meetingRouter.post('/joinmeet',joinMeeting);
meetingRouter.post('/leavemeet',leaveMeeting);
// meetingRouter.post('/getParticipant',getMeetingParticipants);

module.exports=meetingRouter;