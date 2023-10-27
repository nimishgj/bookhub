// Import the Required Modules
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Import the Styling Module
import "../style/dashboard.css"

// Import the image 
import img from "../assets/closeButton.png"

export default function DashBoard() {
  // Variable to select the file
  const fileInputRef = useRef(null);

  // Required Fields for Uploading a Document
  const [name, setName] = useState("");
  const [subject, setsubject] = useState("");
  const [scheme, setscheme] = useState("");

  // Required Fields for Changing Password
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [username,setUsername]=useState("");

  // Required Fields for Displaying the Message
  const [message,setMessage]=useState("");

  // Required Fields for Displaying the Documents
  const [documents, setDocuments] = useState([]);
  const location = useLocation();
  const [data,setData]=useState(location.state);

  // Set the Username and Password
  useEffect(()=>{
    setCurrentPassword(()=>data.userdata.password)
    setUsername(()=>data.userdata.username)
  },[])

  // Function to Add a New Item
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("user", data.userdata.name);
      formData.append("subject", subject);
      formData.append("scheme", scheme);
      const response = await axios.post(
        `http://192.168.1.7:5000/api/documents/${data.userdata.name}`,
        formData
      );
      if(response.status===200){
        setMessage("Document Uploaded successfully");
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage("Document could not be uploaded to Database successfully")
        setTimeout(() => {
          setMessage(null)
        }, 2000);
      }
      

      const res= await axios
        .get(
          `http://192.168.1.7:5000/api/documentsByUploader/${data.userdata.name}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
            },
          }
        )
        .then((response) => {
          console.log(response.data)
          if (response.status===200) {
            setDocuments(response.data);
          } else {
            setMessage("Error in retrieving Documents");
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          }
        });
    } catch (error) {
      // Display the Error Message
      setMessage("Document Uploading Failed");
      setTimeout(() => {
        setMessage(null)
      }, 2000);
      console.log(error);
    }
  };

  // Function to Download a File
  const downloadFile = async (id) => {
    try {
      const res = await axios.get(
        `http://192.168.1.7:5000/api/download/${id}/${data.user}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = res.file;
      //link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
    } catch (error) {
      // Display the Error Message
      setMessage("Document could not be downloaded");
      setTimeout(() => {
        setMessage(null)
      }, 2000);
      console.log(error);
    }
  };

  // Set the Documents
  useEffect(() => {
    setDocuments(() => data.documents);
  }, []);

  // Function to Change the Password
  const handleChangePassword = async () => {
    try {
      const userData = {
        username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      const response = await axios.post('http://192.168.1.7:5000/api/changePassword', userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setMessage("Password Changed successfully")
        setTimeout(() => {
          setMessage(null)
        }, 2000);
        // Update the state with the new password
        setData((prevData) => ({
          ...prevData,
          userdata: {
            ...prevData.userdata,
            password: newPassword,
          },
        }));
      } else {
        console.log("yes  ")
        setMessage("Try again by Refresing again")
        setTimeout(() => {
          setMessage(null)
        }, 2000);
      }
      setNewPassword(null);
      document.getElementById("changePasswordInput").value="";

    } catch (error) {
      // Display the Error Message
      setMessage("Password could not be changed");
      setTimeout(() => {
        setMessage(null)
      }, 2000);
      console.error('Error changing password:', error);
    }
  };


  

  return (
    <div className="setBackgroundDashboard">
        <div className="fontDashboard">Hello, esteemed lecturer</div>
        <div className="changePassword" id="changePassword">
          <div className="closeButton" onClick={()=>{
            document.getElementById("changePassword").style.display="none";
          }}><img src={img} alt="Close Button" /></div>
          <input type="text" placeholder="add password" className="changePasswordInput" id="changePasswordInput"
          onChange={(e) => setNewPassword(()=>e.target.value)}
          onKeyDown={(event)=>{
            if(event.key === 'Enter'){
              event.preventDefault();
              
                handleChangePassword()
                document.getElementById("changePassword").style.display="none";
            }
        }}
        /></div>
        {message && <div className="message" id="message">{message}</div>}
      <div className="dashBoardText">Welcome to your dedicated dashboard, where you have full control over your educational materials. Here, you can effortlessly view all the notes and question papers you've uploaded in the form of documents. Additionally, you have the privilege to add new documents, enriching the resource library. Beyond that, you can access your personal details, including your name, email, and password. Your educational journey is in your hands.</div>
        <div className="borderStyle">
        <div className="addDocument">Details</div>
        <div className="DetailsText">Name:{`${data.userdata.name}`}<br/>Email:{data.userdata.email}<br/>Password:{data.userdata.password}</div>
        <button className="changePasswordButton" onClick={()=>{
          
    document.getElementById("changePassword").style.display="block";
    document.getElementById("changePassword").focus()
        }}>changepassword</button>
        </div>
        
        <div className="borderStyle">
        <div className="addDocument">Add a New Document</div>
      <div className="addItems">

      

        <input
          type="text"
          placeholder="add name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="add scheme"
          onChange={(e) => setscheme(e.target.value)}
        />

        <input
          type="text"
          placeholder="add subject"
          onChange={(e) => setsubject(e.target.value)}
        />
        <input type="file" ref={fileInputRef} />
        <button onClick={addItem}>Add</button>
      </div>
      </div>

        <div className="documentsHead">Documents You Uploaded</div>
        <div className="documents">
  {documents && documents.length > 0 ? (
    documents.map((item) => (
      <div className="documentsInfo" key={item._id}>
        <div className="docs">
          <div>Name:{item.name}</div>
          <div>Subject:{item.subject}</div>
          <div>Scheme:{item.scheme}</div>
        </div>
        <button onClick={() => downloadFile(item._id)}>
          Download File
        </button>
      </div>
    ))
  ) : (
    <div>No documents available.</div>
  )}
</div>

      <div className="gap"></div>
    </div>
  );
}
