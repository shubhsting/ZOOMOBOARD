var randomize = require('randomatic');
let meetingModel = require("../Model/meetingModel");
var moment = require('moment');
const userModel = require('../Model/userModel');
//start a new meeting


async function updateonJoin(socketId, obj) {
    try {
        let { email, meetingId } = obj;
        // console.log(email, meetingId);
        let meeting;

        meeting = await meetingModel.findOne({
            meetingID: meetingId
        });

        if (!meeting) {
            meeting = await meetingModel.create({
                meetingID: meetingId,
                startTime: moment.now(),
            })
        }

        let user = await userModel.findOne({
            email: email
        });
        user = await userModel.findByIdAndUpdate(user.id, { currentMeetingID: meetingId, socketID: socketId }, { new: true });


        let meetingArr = meeting.participants;
        let newArr = [];
        for (let i = 0; i < meetingArr.length; i++) {
            if (meetingArr[i].email !== email) newArr.push(meetingArr[i]);
        }
        // meetingArr = meetingArr.filter((userI) => {
        //     userI.email !== email
        // })
        // console.log(newArr)
        newArr.push(user);
        await meetingModel.findByIdAndUpdate(meeting.id, { participants: newArr, meetingEnded: false }, { new: true })

    }
    catch (e) {
        console.log(e);
    }
}


async function updateonleave(socketId, obj) {
    try {
        let { email, meetingId } = obj;
        // console.log("leave function", email, meetingId);
        let meeting;

        meeting = await meetingModel.findOne({
            meetingID: meetingId
        });


        let user = await userModel.findOne({
            email: email
        });

        await userModel.findByIdAndUpdate(user.id, { currentMeetingID: null, socketID: null }, { new: true });

        let meetingArr = meeting.participants;

        let newArr = [];
        for (let i = 0; i < meetingArr.length; i++) {
            if (meetingArr[i].email !== email) newArr.push(meetingArr[i]);
        }
        if (newArr.length === 0) {
            await meetingModel.findByIdAndUpdate(meeting.id, { meetingEnded: true, participants: newArr }, { new: true });
        }
        else {
            await meetingModel.findByIdAndUpdate(meeting.id, { participants: newArr }, { new: true });
        }
    }
    catch (e) {
        console.log(e);
    }
}


async function createMeeting(req, res) {
    try {
        const { meetingno } = req.body;

        if (meetingno.length !== 8) {
            res.status(400).send("Please enter a 8 digit meeting number");
        }

        let email = req.cookies.email;
        if (!email) return res.status(400).send("Invalid user!");

        let user = await userModel.findOne({
            email: email
        })

        if (!user) return res.status(400).send("Invalid user!");

        let meetinguser;
        if (user.currentMeetingID) {
            meetinguser = await meetingModel.findOne({
                meetingID: user.currentMeetingID
            })
            if (meetinguser.participants.length > 0 && !meetinguser.meetingEnded)
                return res.status(400).send("You are currently into another meeting");
        }


        let meeting = await meetingModel.findOne({
            meetingID: meetingno
        });

        if (meeting && !meeting.meetingEnded) return res.status(400).send("Meeting already exists");

        if (!meeting) {
            meetinguser = await meetingModel.create({
                meetingID: meetingno,
                startTime: moment.now(),
                participants: []
            })
        }
        else {
            meetinguser = await meetingModel.findByIdAndUpdate(meeting.id, { startTime: moment.now(), participants: [], meetingEnded: false })
        }

        user.currentMeetingID = meetingno;
        await user.save();

        res.cookie('meeting', meetingno);
        res.status(200).send("Successfuly joined!")
    }
    catch (e) {
        res.status(400).send(e);
    }

}

//randomatic
//end a meeting

async function endMeeting(req, res) {
    try {
        let { meetingID } = req.body;
        let meet = await meetingModel.findOne({
            meetingID: meetingID
        })

        if (!meet) {
            return res.status(400).send("Meeting doesn't exist or already ended");
        }

        await meetingModel.deleteOne({
            meetingID: meetingID
        });

        res.cookie('meeting', null);
        res.status(200).send("Meeting Ended");

    }
    catch (e) {
        res.status(400).send(e);
    }
}


async function leaveMeeting(req, res) {
    try {
        const { meetingno } = req.body;

        let meeting = await meetingModel.findOne({
            meetingID: meetingno
        });

        if (!meeting) return res.status(400).send("Meeting doesn't exist");

        let email = req.cookies.email;
        if (!email) return res.status(400).send("Invalid user!");

        let user = await userModel.findOne({
            email: email
        })

        if (!user) return res.status(400).send("Invalid user!");




        user.currentMeetingID = null;

        await user.save();
        res.cookie('meeting', meetingno);
        res.status(200).send("Successfuly joined!")
    }
    catch (e) {
        res.status(400).send(e);
    }

}

async function makeadmin(req, res) {

}

async function joinMeeting(req, res) {
    try {
        const { meetingno } = req.body;

        if (meetingno.length !== 8) {
            res.status(400).send("Please enter a 8 digit meeting number");
        }

        let meeting = await meetingModel.findOne({
            meetingID: meetingno
        });

        if (!meeting) return res.status(400).send("Meeting doesn't exist");

        let email = req.cookies.email;
        if (!email) return res.status(400).send("Invalid user!");

        let user = await userModel.findOne({
            email: email
        })

        if (!user) return res.status(400).send("Invalid user!");


        let meetinguser;
        if (user.currentMeetingID) {
            meetinguser = await meetingModel.findOne({
                meetingID: user.currentMeetingID
            })
            if (meetinguser.participants.length > 0 && !meetinguser.meetingEnded)
                return res.status(400).send("You are currently into another meeting");
        }

        // if (user.currentMeetingID) return res.status(400).send("You are currently into another meeting");


        user.currentMeetingID = meetingno;

        await user.save();
        res.cookie('meeting', meetingno);
        res.status(200).send("Successfuly joined!")
    }
    catch (e) {
        res.status(400).send(e);
    }

}


async function findAllSocketIdOfThisMeeting(email, meetingId) {
    try {
        let meeting = await meetingModel.findOne({
            meetingID: meetingId
        });
        if (!meeting || meeting.meetingEnded) return;
        let sockets = [];
        let isAdmin = false;
        let participants = meeting.participants;
        participants.forEach((entry) => {
            sockets.push(entry.socketID);
            if (entry.email === email) isAdmin = entry.isAdmin ? entry.isAdmin : false;
        })
        return { isAdmin:true, sockets }
    }
    catch (e) {

    }
}

module.exports = {
    createMeeting,
    updateonJoin,
    updateonleave,
    joinMeeting,
    findAllSocketIdOfThisMeeting
}

