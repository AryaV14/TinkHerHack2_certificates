import React, { Component } from "react";
// import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import PreviewPage from "./PreviewPage";
import { db } from "./firebaseConfig"
// import { collection, onSnapshot, orderBy, query } from "firebase/firestore" ;
import { collection, query, where, getDocs } from "firebase/firestore";



const certificateOptions = [
  { label: "None", value: "" },
  { label: "Muthoot Institute of Technology and Science (MITS)", value: "1.png" },
  { label: "Sullamussalam Science College", value: "2.png" },
  { label: "GEC Kannur - Hostel", value: "3.png" },
  { label: "Christ College", value: "4.png" },
  { label: "CEK Karunagapally", value: "5.png" },
  { label: "COE vadakara", value: "6.png" },
  { label: "COE Munnar", value: "7.png" },
  { label: "Jyothy Engineering College", value: "8.png" },
  { label: "Kmea College Of Engineering", value: "9.png" },
  { label: "SCMS", value: "10.png" },
  { label: "MACE", value: "11.png" },
  { label: "CEMP", value: "12.png" },
  { label: "GEC Palakkad", value: "13.png" },
  { label: "Rajagiri", value: "14.png" },
  { label: "GEC Thrissur", value: "15.png" },
  { label: "LBSCEK - hostel", value: "16.png" },
  { label: "Vimal jyothy - hostel", value: "17.png" },
  { label: " College of Engineering Pathanapuram", value: "18.png" },
  { label: "LBS trivandrum", value: "19.png" },
  { label: "NSSCE Palakkad", value: "20.png" },
  { label: "TinkerSpace", value: "21.png" },
  { label: "TKM college of engineering, Kollam", value: "22.png" },
  { label: "Adi Sankara Kalady", value: "23.png" },
  { label: "ASET", value: "24.png" },
  { label: "Saintgits", value: "25.png" },
  { label: "RIT", value: "26.png" },
  { label: "Zil money", value: "27.png" },
  { label: "College of Engineering, Chengannur", value: "28.png" },
  // Add more certificates here as needed
];

class App extends Component {
  certificateWrapper = React.createRef();
  state = {
    teamName: "",
    teamLeadEmail: "",
    selectedCertificate: "",
    teamMembers: [],
    previewMode: false,
    filteredTeamNames: []
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });

    // Filter team names based on input value
    this.filterTeamNames(value);
  };

  filterTeamNames = async (inputValue) => {
    try {
      const q = query(collection(db, "Participants"), where("Team Name", ">=", inputValue));
      const querySnapshot = await getDocs(q);
  
      const filteredTeamNames = querySnapshot.docs.map((doc) => doc.data()["Team Name"]);
  
      // Convert input value to lowercase (or uppercase)
      const lowerInputValue = inputValue.toLowerCase(); // or inputValue.toUpperCase()
  
      // Filter team names case insensitively
      const filteredNames = filteredTeamNames.filter(name =>
        name.toLowerCase().includes(lowerInputValue)
      );
  
      this.setState({ filteredTeamNames: filteredNames });
    } catch (error) {
      console.error("Error filtering team names:", error);
    }
  };
  
  


  fetchTeamData = async () => {
    let { teamName, teamLeadEmail } = this.state;
    
    // Convert teamName to lowercase (or uppercase)
    teamName = teamName.toLowerCase(); // or teamName.toUpperCase();

    try {
        const q = query(collection(db, "Participants"), where("Team Lead Email", "==", teamLeadEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Team not found for the given Team Lead Email.");
            return;
        }

        let found = false;
        const teamMembers = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Convert data["Team Name"] to lowercase (or uppercase)
            const firebaseTeamName = data["Team Name"].toLowerCase(); // or data["Team Name"].toUpperCase();
            if (firebaseTeamName === teamName) {
                found = true;
                // Split the team members string by commas
                const members = data["Team Members"].split(",");
                teamMembers.push(...members);
            }
        });

        if (found) {
            this.setState({ teamMembers: teamMembers, previewMode: true });
            console.log(teamMembers);
        } else {
            alert("Team not found for the given Team Name and Team Lead Email.");
            this.setState({ teamMembers: [], previewMode: false });
        }
     
    } catch (error) {
        console.error("Error fetching team data:", error);
    }
};




downloadAllCertificates = async () => {
  const zip = new JSZip();
  const imgFolder = zip.folder("certificates");

  // Function to convert div to base64 image
  const convertDivToImage = async (divId) => {
    const div = document.getElementById(divId);
    const canvas = await html2canvas(div);
    return canvas.toDataURL("image/png");
  };

  // Loop through team members sequentially and add images to ZIP
  for (let i = 0; i < this.state.teamMembers.length; i++) {
    const member = this.state.teamMembers[i];
    const wrapperId = `Wrapper_${i}`;
    
    // Use the wrapper ID specific to each member
    const imageData = await convertDivToImage(wrapperId);
    imgFolder.file(`${member}.png`, imageData.split("base64,")[1], { base64: true });
    console.log(`Added image for ${member}`);
  }
  // Generate zip file after all images are added
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "certificates.zip");
  });
};



render() {
  const { selectedCertificate, previewMode, filteredTeamNames } = this.state;

  if (previewMode) {
    return (
      <PreviewPage
        teamMembers={this.state.teamMembers}
        selectedCertificate={selectedCertificate}
        downloadAllCertificates={this.downloadAllCertificates}
      />
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Tink-Her-Hack 2.0</h1>
        <button
          onClick={() => {
            window.open("https://docs.google.com/forms/d/e/1FAIpQLSfeC5tT6BmKwAo_W_vwhZcMjf3L-pjb8fV3EJCaW-DmA849EQ/viewform", "_blank");
          }}
        >
          Contact Us
        </button>
      </div>
      <div className="Meta">
        <h2>Certificates</h2>
        <p>Team Name</p>
        <input
          type="text"
          name="teamName"
          placeholder="Please enter team name..."
          value={this.state.teamName}
          onChange={this.handleInputChange}
        />
        {/* Display filtered team names as a selectable dropdown */}
        <select
          size="5"
          style={{ height: "100px" }}
          onChange={(e) => this.setState({ teamName: e.target.value })}
          value={this.state.teamName}
        >
          {filteredTeamNames.map((name, index) => (
            <option key={index} value={name}>
              {name} {/* Display original case */}
            </option>
          ))}
        </select>

        <p>Email ID</p>
        <input
          type="text"
          name="teamLeadEmail"
          placeholder="Please enter team lead's email..."
          value={this.state.teamLeadEmail}
          onChange={this.handleInputChange}
        />
        <p>Choose your venue</p>
        <select
          value={selectedCertificate}
          onChange={(e) => this.setState({ selectedCertificate: e.target.value })}
        >
          {certificateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="btn">
          <button onClick={this.fetchTeamData}>Preview</button>
        </div>
      </div>
    </div>
  );
}
}
  
  export default App;