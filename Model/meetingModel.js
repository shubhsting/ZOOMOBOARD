const mongoose = require('mongoose');
// const { url } = require('../secrets');
require('dotenv').config()
const url=process.env.URL;
const Schema = mongoose.Schema;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


const meetingSchema = new Schema({
   meetingID:{
       type:String,
       required:true
   },
   meetingName:{
       type:String,
   },
   startTime:{
       type:Date,
   },
   meetingEnded:{
    type:Boolean
   },
   admin:{
    type:String,
   },
   participants:{
       type:Array
   }
  });

const meetingModel=mongoose.model('meetingModel',meetingSchema);

module.exports=meetingModel;