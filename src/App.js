import React, { Component } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

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
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  fetchTeamData = async () => {
    const { teamName, teamLeadEmail } = this.state;

    try {
      const response = await fetch(`/tink.xlsx`);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        // Assuming Excel structure: [Team Name, Team Lead Email, Members]
        const teamInfo = excelData.find(
          (row) => row["TeamName"] === teamName && row["TeamLeadEmail"] === teamLeadEmail
        );
        
        if (teamInfo) {
          const members = teamInfo["Members"];
          if (members) {
            const memberList = members.split(",");
            this.setState({ teamMembers: memberList });
          } else {
            this.setState({ teamMembers: [] });
            alert("No members found for the given team.");
          }
        } else {
          this.setState({ teamMembers: [] });
          alert("Team not found for the given Team Name and Team Lead Email.");
        }
      };

      reader.readAsBinaryString(blob);
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
    for (const member of this.state.teamMembers) {
      const imageData = await convertDivToImage("certificateWrapper");
      imgFolder.file(`${member}.png`, imageData.split("base64,")[1], { base64: true });
      console.log(`Added image for ${member}`);
    }

    // Generate zip file after all images are added
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "certificates.zip");
    });
  };

  render() {
    return (
      <div className="App">
        <div className="Meta">
          <h1>Tink-Her-Hack 2.0</h1>
          <h2>Certificates</h2>
          <p>Team lead</p>
          <input
            type="text"
            name="teamName"
            placeholder="Please enter team name..."
            value={this.state.teamName}
            onChange={this.handleInputChange}
          />
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
            value={this.state.selectedCertificate}
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
            <button onClick={this.downloadAllCertificates}>Download All</button>
          </div>
        </div>

        {/* Render certificates for preview */}
        {this.state.teamMembers.length > 0 && (
          <div className="preview">
            <h3>Certificates Preview</h3>
            {this.state.teamMembers.map((member, index) => (
              <div key={index} id="certificateWrapper" ref={this.certificateWrapper}>
                <p>{member}</p>
                <img src={`./${this.state.selectedCertificate}`} alt="Certificate" />
              </div>
            ))}
          </div>
        )}

        {/* Display message if no team members */}
        {this.state.teamMembers.length === 0 && (
          <div className="nothing">No team members to display.</div>
        )}
      </div>
    );
  }
}

export default App;