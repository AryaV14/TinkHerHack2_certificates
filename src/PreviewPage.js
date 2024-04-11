import React from "react";


const PreviewPage = ({ teamMembers, selectedCertificate, downloadAllCertificates }) => {
  return (
    <div className="App">
      <div className="header">
        <a href="App.js"><h1>Tink-Her-Hack 2.0</h1></a>
        <button
          onClick={() => {
            window.open("https://your-form-link-here", "_blank");
          }}
        >
          Contact Us
        </button>
      </div>
      <div className="preview">
        <h3>Certificates Preview</h3>
        {teamMembers.map((member, index) => (
          <div key={index} id="certificateWrapper">
            <p>{member}</p>
            <img src={`./${selectedCertificate}`} alt="Certificate" />
          </div>
        ))}
        <div className="btn">
          <button onClick={downloadAllCertificates}>Download All</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
