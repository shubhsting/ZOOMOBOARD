require('dotenv').config()
const express = require("express");
const path = require("path");
var cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const viewRouter = require("./Router/ViewRouter");
const userRouter = require("./Router/userRouter");
const meetingRouter = require("./Router/meetingRouter");
const { updateonJoin ,updateonleave,findAllSocketIdOfThisMeeting} = require("./Controller/meetingController");





app.set("view engine" , "pug");

// view path set
app.set("views" , path.join(__dirname,"public"));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/', viewRouter);
app.use('/api/user',userRouter);
app.use('/api/meeting',meetingRouter);

app.use(express.static(__dirname+"/public"));




const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: '*',
    }
});



io.on("connection", async function (socket) {
    console.log(`${socket.id} connected`);
    await updateonJoin(socket.id,socket.request._query);
    let {email,meetingId}=socket.request._query
    socket.join(meetingId);

    socket.on('disconnect',async ()=>{
        await updateonleave(socket.id,socket.request._query)
        console.log(socket.id+" disconnected");
    })
    // socket.broadcast.emit("userConnected", socket.id);

    // socket.on("imagecome", function (data) {
    //     socket.broadcast.emit("imgcome", data);
    // })
    socket.on("modechange", function (data) {
        // console.log("mode changed by",socket.id);
        // console.log("mode changed ",data.email,data.meetingId)
        // await findAllSocketIdOfThisMeeting(data.email,data.meetingId);
        socket.to(data.meetingId).emit("mc", data.info);
    })
    socket.on("mousedown", function (data) {
        // console.log("mousedown ho gya",data.email,data.meetingId)
        socket.to(data.meetingId).emit("md", data.info);
    });


    socket.on("mousemove", function (data) {
        // console.log("mousemove ho ra hai",data.email,data.meetingId)
        socket.to(data.meetingId).emit("mm", data.info);
    })

    socket.on("stickyaagya", function (data) {
        // console.log("sticky aa gya",data.email,data.meetingId)
        socket.to(data.meetingId).emit("staagya", data.info);
    })


    socket.on("clearall", function (data) {
        // console.log("clear all ho ra hai",data.email,data.meetingId)
        socket.to(data.meetingId).emit("clrall", data.info);
    })
});
const port = process.env.PORT || 3000;

http.listen(port, () => {
    console.log("listening on *:3000");
});