// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Home = () => {
//   const [selectedOption, setSelectedOption] = useState('');
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!file || !selectedOption) {
//       alert('Please select an option and upload a file.');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('selectedOption', selectedOption);
  
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
    
//       console.log('Response:', response);  // Add this line to log the response
    
//       if (response.status === 200) {
//         alert('File uploaded successfully!');
//       }
    
//     } catch (error) {
//       console.error('Error Response:', error);  // Log the full error object for better debugging
//       if (error.response && error.response.status === 409) {
//         alert('Entry already exists in the database.');
//       } else {
//         console.error('There was an error uploading the file!', error);
//         alert('Failed to upload the file.');
//       }
//     }    
//   };
  


//   return (
//     <div>
//       <h1>File Upload</h1>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="file">Select PDF:</label>
//         <input type="file" id="file" name="file" accept="application/pdf" onChange={handleFileChange} required /><br /><br />
//         <label>
//         <input type="radio" id="radio1" name="option"  value="Invoice Upload" checked={selectedOption ==='Invoice Upload'} onChange={handleOptionChange} required />
//                   Invoice Upload
//         </label><br />
//         <label>
//         <input type="radio" id="radio2" name="option" value="Remittance Advice Upload" checked={selectedOption ==='Remittance Advice Upload'} onChange={handleOptionChange} required />
//                   Remittance Advice Upload
//         </label><br /><br />
//         <button type="submit">Submit</button>
//         </form>
//     </div>
//   );
// };

// export default Home;

import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component
import './Home.css'; // Add your styles

const Home = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !selectedOption) {
      showModal('Please select an option and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('selectedOption', selectedOption);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('File uploaded successfully!');
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          showModal('Entry already exists in the database.');
        } else if (error.response.status === 400) {
          showModal('Bad request: ' + error.response.data.error);
        } else {
          showModal('Failed to upload the file: ' + (error.response.data.error || 'Unknown error'));
        }
      } else {
        showModal('Failed to upload the file.');
      }
    }    
  };

  const showModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>

        <label htmlFor="file">Select PDF:</label>
        <input type="file" id="file" name="file" accept="application/pdf" onChange={handleFileChange} required /><br /><br />
        <label>
          <input type="radio" id="radio1" name="option" value="Invoice Upload" checked={selectedOption === 'Invoice Upload'} onChange={handleOptionChange} required />
          Invoice Upload
        </label><br />
        <label>
          <input type="radio" id="radio2" name="option" value="Remittance Advice Upload" checked={selectedOption === 'Remittance Advice Upload'} onChange={handleOptionChange} required />
          Remittance Advice Upload
        </label><br /><br />
        <button type="submit">Submit</button>
      </form>

      {isModalOpen && <Modal message={errorMessage} onClose={closeModal} />} {/* Show modal when open */}
    </div>
  );
};

export default Home;
