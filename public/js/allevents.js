var axios = require('axios');
// const { backendurl } = require('../../secrets');
require('dotenv').config()
const backendurl=process.env.BACKEND_URL;

// ====================================signup =====================================
var signupbutton = document.querySelector('.btn.signupbutton');
var signupusername = document.querySelector('.signupusername');
var signupemail = document.querySelector('.signupemail');
var signuppassword = document.querySelector('.signuppassword');


//==================================login==============================
var loginbutton = document.querySelector('.loginbutton');
var loginemail = document.querySelector('.loginemail');
var loginpassword = document.querySelector('.loginpassword');

let allparticipants=document.querySelector('#allparticipants');
var meetingid=document.querySelector('.meetingid');
var error = document.querySelector(".error");


var newmeeting=document.querySelector('.newmeeting');
var newmeetingbtn=document.querySelector('.newmeetingbtn');

var joinmeeting=document.querySelector('.joinmeeting');
var joinmeetingbtn=document.querySelector('.joinmeetingbtn');

if(signupbutton){
    signupbutton.addEventListener("click", async () => {
      try {
        let username = signupusername.value;
        let email = signupemail.value;
        let password = signuppassword.value;

        axios({
          method: 'post',
          url: `https://zoomoboard.herokuapp.com/api/user/register`,
          data: {
            username,
            email,
            password
          }
        })
          .then((res) => {
            if (res.status === 200) { console.log("user registered!");window.location.href='/login'; }
          })
          .catch(err => {
            if (err.request) { console.log(err.request); }
            if (err.response) {error.innerHTML=err.response.data;}
          });
      }
      catch (e) {
        console.log(e);
      }
    });
}

if(loginbutton){
    loginbutton.addEventListener("click", async () => {
      try {
        // let username = signupusername.value;
        let email = loginemail.value;
        let password = loginpassword.value;
        // console.log(req.cookies);
        console.log(document.cookie)
        axios({
          method: 'post',
          url: `https://zoomoboard.herokuapp.com/api/user/loginuser`,
          data: {
            email,
            password
          }
        })
          .then((res) => {
            if (res.status === 200) { console.log("user loggedin!");window.location.href='/joinmeet'; }
          })
          .catch(err => {
            if (err.request) { console.log(err.request); }
            if (err.response) {error.innerHTML=err.response.data;}
          });
      }
      catch (e) {
        console.log(e);
      }
    });
}

if(newmeetingbtn){
  newmeetingbtn.addEventListener('click',async()=>{
    try{
      let meetingId=newmeeting.value;
      axios({
        method: 'post',
        url: `https://zoomoboard.herokuapp.com/api/meeting/newmeet`,
        data: {
         meetingno:meetingId
        }
      })
        .then((res) => {
          if (res.status === 200) { console.log("user loggedin!");window.location.href='/board'; }
        })
        .catch(err => {
          if (err.request) { console.log(err.request); }
          if (err.response) {error.innerHTML=err.response.data;}
        });
    }
    catch(e){

    }
  })
}

if(joinmeetingbtn){
  // console.log(en)
  joinmeetingbtn.addEventListener('click',async()=>{
    try{
      let meetingId=joinmeeting.value;
      console.log(meetingId);
      axios({
        method: 'post',
        url: `https://zoomoboard.herokuapp.com/api/meeting/joinmeet`,
        data: {
         meetingno:meetingId
        }
      })
        .then((res) => {
          if (res.status === 200) { console.log("user loggedin!");window.location.href='/board'; }
        })
        .catch(err => {
          if (err.request) { console.log(err.request); }
          if (err.response) {error.innerHTML=err.response.data;}
        });
    }
    catch(e){

    }
  })
}


if(allparticipants){

    allparticipants.addEventListener("click",async function () {
        allparticipants.classList.add("nightmode");

        let participants = document.createElement("div");
        participants.classList.add("participants");

      // ===============header
        let headerpart = document.createElement("div");
        headerpart.classList.add("parheader");
        headerpart.innerText='All Participants';
        let closediv = document.createElement("div");
        closediv.classList.add("close");

        let imgclose = document.createElement("img");
        imgclose.setAttribute("src", "./images/close.png");
        imgclose.setAttribute("id", "imgo");

        closediv.appendChild(imgclose);

        headerpart.appendChild(closediv);



        // ============================body part=======
        let bodypart = document.createElement("div");
        bodypart.classList.add("parbody");
        let meetingId=meetingid.innerText;
        // console.log(meetingId);

        axios({
          method: 'post',
          url: `https://zoomoboard.herokuapp.com/api/user/getParticipant`,
          data: {
            meetingId
          }
        })
          .then((res) => {
            if (res.status === 200) { 
              let participantarr=res.data;
              // console.log(participantarr);
              for(let i=0;i<participantarr.length;i++){

                let singleparticipant = document.createElement("div");
                singleparticipant.classList.add("singleparticipant");      
                let profile = document.createElement("div");

                profile.classList.add("profile");
                
                profile.innerText=participantarr[i].name[0];
          
                let namepart = document.createElement("div");
                namepart.classList.add("namepart");
                
                namepart.innerText=participantarr[i].name;
          
                singleparticipant.appendChild(profile);
                singleparticipant.appendChild(namepart);
                bodypart.appendChild(singleparticipant);
            
            }



            participants.appendChild(headerpart);

            participants.appendChild(bodypart);
        
        
            document.body.appendChild(participants);
          
            closediv.addEventListener("click", function () {
              participants.remove();
            })
            

          }
          })
          .catch(err => {
            if (err.request) {console.log(err.request)}
            if (err.response) {console.log(err.response)}
          });
        setTimeout(function () {
            allparticipants.classList.remove("nightmode");
        }, 300);
    });

}