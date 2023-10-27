// Import the required Modules
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Import the Styling Module
import "../style/login.css";


export default function Login() {
  // variable to Store the Type of User
  const [token, setToken] = useState("");

  // variables to Store the Username and Password
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  // Declaring the Required variables
  const [buttonClicked,setButtonClicked]=useState(false);
  const [loginSelected, setLoginSelected] = useState(false);
  const [invalidDetails,setinvalidDetails]=useState(false);

  // Navigate to the Home Page
  const navigate = useNavigate();

  // Function to Handle the Login Process
  const handleLogin = () => {

    // Check if the User is Student
    if(token==="student"){
        // Check for valid Login Details and then Navigate to Home Screen
        if(parseInt(userName.slice(-3), 10)>=1 && parseInt(userName.slice(-3), 10) <= 500 ){
            navigate("/home",{ state:{user:userName}});
        } else {
            // Display the Invalid Details Message
            setinvalidDetails(()=>true);
                    setInterval(() => {
                        setinvalidDetails(()=>false);
                    }, 10000);
        }
    // Check if the User is Teacher or Admin
    } else if(token==="teacher" || token==="admin"){
        try {
            // POST to loginAuth 
            axios
              .post(
                "http://192.168.1.7:5000/api/loginAuth",
                {
                  username: userName,
                  password: password,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                // If message field Appears then the User has Provided Invalid Details
                if(response.data.message){
                    setinvalidDetails(()=>true);
                    setInterval(() => {
                        setinvalidDetails(()=>false);
                    }, 10000);
                    setPassword("")
                    setUserName("")
                    document.getElementById("username").value="";
                    document.getElementById("password").value="";
                // If the User is Teacher or Admin then Navigate to the Respective DashBoard
                } else if (response.data.userdata.role === token) {
                  if (token === "teacher") {
                    navigate("/DashBoard", { state: response.data});
                  } else if (token === "admin") {
                    navigate("/admin",{state:response.data.userdata});
                  }
                } 
              });
          } catch (error) {
            // Log the Error Message
            console.log(error);
          }
    }
  };

// Constantly check if the Type of User is Selected
  useEffect(()=>{
    if(buttonClicked===true){
        document.getElementById("username").focus();
        setButtonClicked(()=>false)
    }
  },[buttonClicked])
  
  


  return (
    <div>
        {invalidDetails && <div className="invalidDetails">Invalid Details Provided</div>}
      {!loginSelected && (
        <div className="welcomeScreenBackground" id="welcomeScreenBackground">
          <div>
            <div className="adjustFontSize">
              Welcome 
            </div>
            to our educational Platform <br/><br/>
            This is where you can access a comprehensive repository of academic
            resources, including previous year question papers, notes, current
            year's uploads, and syllabus copies. We are committed to supporting
            your academic journey with valuable materials to enhance your
            learning experience.
          </div>
          <button onClick={() => setLoginSelected(() => true)}>
            login
          </button>
        </div>
      )}

      {loginSelected && (
        <div className="setBackground">
          



          <div className="s">
          <div className="selectTypeOfLoginUser alignOptions">
            <motion.button
              onClick={() => {
                setToken("student");
                setButtonClicked(()=>true)
                document
                  .getElementById("inputDisplay")
                  .classList.remove("something");
              }}
              whileHover={{ scale: 1.1 }} // Increase the size by 10% on hover
              onHoverStart={
                () => {
                  document.getElementById("some").innerHTML="As a student, access all available documents, search, and download by scheme and subject";
                  document.getElementById("some").style.backgroundColor="#d0cfce";
                  
                }
              }
              onHoverEnd={
                () => {
                  document.getElementById("some").innerHTML="";
                  document.getElementById("some").style.backgroundColor="#c5c3c2";
                }
              }
            >
              Student
            </motion.button>
            <motion.button
              onClick={() => {setToken("teacher");
              setButtonClicked(()=>true)
              document
              .getElementById("inputDisplay")
              .classList.remove("something");}}
              whileHover={{ scale: 1.1 }} // Increase the size by 10% on hover
              onHoverStart={
                () => {
                  document.getElementById("some").innerHTML="As a teacher, you have the capability to upload documents based on scheme or subject. Additionally, you can view and manage all youruploaded documents, ensuring an organized and efficient document management experience."
                  document.getElementById("some").style.backgroundColor="#d0cfce";
                  
                }
              }
              onHoverEnd={
                () => {
                  document.getElementById("some").innerHTML=""
                  document.getElementById("some").style.backgroundColor="#c5c3c2";
                }
              }
            >
              Teacher
            </motion.button>
            <motion.button
              onClick={() => {setToken("admin");
              
              setButtonClicked(()=>true)
              document
              .getElementById("inputDisplay")
              .classList.remove("something");}}
              whileHover={{ scale: 1.1 }} // Increase the size by 10% on hover
              onHoverStart={
                () => {
                  document.getElementById("some").innerHTML="As an administrator, you have access to view system logs and acomprehensive list of all documents uploaded. You also possess the authority to delete documents, maintaining control over the document repository and system oversight"
                  document.getElementById("some").style.backgroundColor="#d0cfce";
                  
                }
              }
              onHoverEnd={
                () => {
                  document.getElementById("some").innerHTML=""
                  document.getElementById("some").style.backgroundColor="#c5c3c2";
                }
              }
            >
              Admin
            </motion.button>
          </div>
          <div className="some" id="some"></div>
          <div className="something" id="inputDisplay">
            <div className="formInput">
              <input
                type="text"
                id="username"
                placeholder={`${token === "student" ? "USN" : "Username"}`}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(event)=>{
                    if(event.key === 'Enter' && token==="student"){
                        handleLogin()
                    }
                }}
              />
              {token !== "student" && (
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(event)=>{
                    if(event.key === 'Enter'){
                        handleLogin()
                    }
                }}
                />
              )}

              <button className="loginButton" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
            }
