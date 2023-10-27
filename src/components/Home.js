// Import the Required Modules
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Import the Styling Module
import "../style/home.css";

export default function Home() {
  // Declaring Required Variables
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [subjectSelected, setsubjectSelected] = useState(false);
  const [schemaSelected, setschemaSelected] = useState(false);
  const [documents, setdocuments] = useState([]);
  const [message,setMessage]=useState(null);
  const location = useLocation();
  const data = location.state;

  // Fetching Schema List on Component Mount
  useEffect(() => {
    req()
  }, [data.user]);

  const req = async()=>{
    const res=await axios.get(`http://192.168.1.7:5000/api/documents/${data.user}`).then((res) => {
      setdocuments(res.data.items);
    });
  }

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
      setMessage("Document could not be downloaded");
      setTimeout(() => {
        setMessage(null)
      }, 2000);
      console.log(error);
    }
  };

  const request = async () => {
    const res= await axios
      .get("http://192.168.1.7:5000/api/getschema")
      .then((res) => {
        setSchemas(res.data);
      });
  };
  useLayoutEffect(() => {
    req()
    request();
  }, []);

  // Function to Fetch Documents by Schema
  const handleSelectSchema = (event) => {
    setSelectedSchema(event.target.value);
    setschemaSelected(() => true);

    document.getElementById("schemaSelectButton").style.backgroundColor =
      "#c5c3c2";
    document.getElementById("schemaSelectButton").style.color = "#113946";
    document.getElementById("schemaSelectButton").style.border="solid";
  };

  // Function to Fetch Documents by Subject
  const handleSubjectSelected = (event) => {
    setSelectedSubject(() => event.target.value);
    setsubjectSelected(() => true);

    document.getElementById("subjectSelectButton").style.backgroundColor =
      "#c5c3c2";
    document.getElementById("subjectSelectButton").style.color = "#113946";
    document.getElementById("subjectSelectButton").style.border="solid";
  };

  useEffect(() => {
    const filteredDocuments = [];

    for (let i = 0; i < documents.length; i++) {
      if (documents[i].subject === selectedSubject) {
        filteredDocuments.push(documents[i]);
      }
    }
    // filteredDocuments now contains an array of documents where subject is "asd"
    setdocuments(() =>
      documents.filter((document) => document.subject === selectedSubject)
    );
    setschemaSelected(() => false);
  }, [subjectSelected]);

  // Fetch the Documents after the User Input
  useEffect(() => {
    try {
      if (schemaSelected) {
        axios
          .post(
            `http://192.168.1.7:5000/api/documentByScheme`,
            {
              scheme: selectedSchema,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setdocuments(() => res.data);
          })
          .catch((error) => {
            
            console.error("Error fetching documents:", error);
          });
      }
      setschemaSelected(() => false);
    } catch (error) {
      setMessage("Error Fetching documents");
      setTimeout(() => {
        setMessage(null)
      }, 2000);
      console.log(error);
    }
  }, [schemaSelected]);

  

  return (
    <div className="setBackgroundHome">
      {message && <div className="message">{message}</div>}
      <div className="adjustFontSize">Hello, dear user!</div>
      <div className="homeText">
        Here, you can conveniently access a wide range of uploaded documents.
        Feel free to explore and download them at your convenience. You have the
        option to filter documents based on academic year schemes and subjects.
        Additionally, you can easily view available notes and question papers to
        support your learning journey. Happy exploring!
        <br />
      </div>
    
      <select
        value={selectedSchema || ""}
        onChange={(event) => handleSelectSchema(event)}
        className="schemaSelectButton"
        id="schemaSelectButton"
      >
        <option value="">Select a schema</option>
        {schemas.map((schema, index) => (
          <option key={index} value={schema.schema}>
            {schema.schema}
          </option>
        ))}
      </select>

      {selectedSchema && (
        <select
          value={selectedSubject || ""}
          onChange={(event) => handleSubjectSelected(event)}
          className="subjectSelectButton"
          id="subjectSelectButton"
        >
          <option value="">Select a subject</option>
          {schemas
            .find((item) => item.schema === selectedSchema)
            .subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
        </select>
      )}

<div className="documents">
        {documents &&
          documents.map((item) => (
            <div className="documentsInfo" key={item._id}>
              <div className="docs"><div>Name:{item.name}</div>
                <div>Subject:{item.subject}</div>
                <div>Scheme:{item.scheme}</div></div>
                
              <button onClick={() => downloadFile(item._id)}>
                Download File
              </button>
            </div>
          ))}
      </div>
      <div className="gap"></div>
    </div>
  );
}
