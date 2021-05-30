const express = require("express");
const path = require("path");
var cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const viewRouter = require("./Router/ViewRouter");
const userRouter = require("./Router/userRouter");
const meetingRouter = require("./Router/meetingRouter");
const { updateonJoin ,updateonleave} = require("./Controller/meetingController");





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

    socket.on('disconnect',async ()=>{
        await updateonleave(socket.id,socket.request._query)
        console.log(socket.id+" disconnected");
    })
    // socket.broadcast.emit("userConnected", socket.id);

    // socket.on("imagecome", function (data) {
    //     socket.broadcast.emit("imgcome", data);
    // })
    socket.on("modechange", function (data) {
        console.log("mode changed by",socket.id);
        socket.broadcast.emit("mc", data);
    })
    socket.on("mousedown", function (data) {
        socket.broadcast.emit("md", data);
    });


    socket.on("mousemove", function (data) {
        socket.broadcast.emit("mm", data);
    })

    socket.on("stickyaagya", function (data) {
        socket.broadcast.emit("staagya", data);
    })


    socket.on("clearall", function (data) {
        socket.broadcast.emit("clrall", data);
    })
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});