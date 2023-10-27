import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../style/admin.css";

export default function Admin() {
  const [name, setName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [typed,settyped]=useState(false);
  const location = useLocation();
  const data = location.state;
  const [message,setMesssage]=useState("");
  const navigate = useNavigate();

  const makingRequest = async () => {
    await axios.get(`http://192.168.1.7:5000/api/documents/${data.name}`).then((res) => {
      setDocuments(res.data.items);
    });

    await axios.get("http://192.168.1.7:5000/api/getLogs").then((res) => {
      if (res.status === 200) {
        setLogs(() => res.data);
      } else {
        setLogs(() => ["No logs found"]);
      }
    });
  }

  useEffect(() => {
    if (data && data.role === "admin") {
      // The `data.role` property exists and is "admin"
      // You can proceed with your component logic
      makingRequest(); // You may call your request function here
    } else {
      // `data.role` is not "admin," navigate to the desired route
      navigate("/");
    }
  }, [data, navigate]);
  useEffect(() => {
    if(name==="" && typed){
      makingRequest()
    }
  }, [typed]);

  

  const downloadFile = async (id) => {
    try {
      const res = await axios.get(
        `http://192.168.1.7:5000/api/download/${id}/${data.name}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = res.file;
      // link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
    } catch (error) {
      setMesssage("Document could not be downloaded")
      setTimeout(() => {
        setMesssage("");
      }, 3000);
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      const filteredDocs = documents.filter((document) =>
        document.name.toLowerCase().includes(name.toLowerCase())
      );
      setDocuments(() => filteredDocs);
    } catch (error) {
      console.log(error);
    }
  }, [name]);

  const handleDelete = (id) => {
    try{
      axios.delete(`http://192.168.1.7:5000/api/${id}`).then((res) => {
      if (res.status === 200) {
        alert("Document deleted successfully");
        setDocuments(() => documents.filter((document) => document._id !== id));
      } else {
        alert("Document could not be deleted");
      }
    });
    } catch(error){
      setMesssage("Document could not be deleted")
      setTimeout(() => {
        setMesssage("");
      }, 3000);
      console.log(error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.7:5000/api/downloadLogs",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "logs.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMesssage("logs could not be downloaded")
      setTimeout(() => {
        setMesssage("");
      }, 3000);
      console.error("Error downloading file:", error);
    }
  }

  const handleDownloadErrors = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.7:5000/api/downloadErrors",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "errors.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMesssage("Error logs could not be downloaded")
      setTimeout(() => {
        setMesssage("");
      }, 3000);
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="setBackGroundAdmin">
      {message && <div className="message">{message}</div>}
      <div className="adminHeading">Hello admin</div>

      <div className="adminText">
        some text about adminThis is where you can access a comprehensive
        repository of academic resources, including previous year question
        papers, notes, current year's uploads, and syllabus copies. We are
        committed to supporting your academic journey with valuable materials to
        enhance your learning experience.
      </div>

      <div >Recent Logs:</div>

      {logs &&
        logs.map((log) => {
          return <div key={log._id} className="RecentLogs">- {log.log}</div>
        })
      }

      <div className="buttonHandleCSS"><button className="cssButton" onClick={handleDownload}>Download all the logs file here</button>
      <button className="cssButton" onClick={handleDownloadErrors}>Download all the errors file here</button>
</div>
      <input
        type="text"
        placeholder="Search document by name"
        className="searchDocument"
        value={name} // Reflect the state in the input field
        onChange={(e) => {
          settyped(true);
          setName(e.target.value); // Set the 'name' state directly
        }}
      />

      <div className="documents">{documents &&
        documents.map((item) => (
          <div className="documentsInfo" key={item._id}>
            <div className="docs"><div className="documentName">Name:{item.name}</div>
            
            <div className="documentSubject">Subject:{item.subject}</div>
                <div className="documentScheme">Scheme:{item.scheme}</div></div>
            <div className="docsButton"><button onClick={() => handleDelete(item._id)}>Delete</button>
            <button onClick={() => downloadFile(item._id)}>Download File
            </button></div>
              
          </div>
        ))}</div>
        <div className="gap"></div>
    </div>
  );
}
