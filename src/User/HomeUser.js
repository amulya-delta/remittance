import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./HomeUser.css"
const HomeUser = () => {
  const [documents, setDocuments] = useState([]);
 
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
 
    fetchDocuments();
  }, []);
 
  return (
<div>
<h1>Uploaded Documents</h1>
<table>
<thead>
<tr>
<th>ID</th>
<th>Date</th>
<th>Time</th>
<th>Filename</th>
<th>Checklist</th>
<th>Filepath</th>
<th>Download</th>
</tr>
</thead>
<tbody>
          {documents.map((doc) => (
<tr key={doc.id}>
<td>{doc.id}</td>
<td>{doc.date}</td>
<td>{doc.time}</td>
<td>{doc.filename}</td>
<td>{doc.checklist}</td>
<td>{doc.filepath}</td>
<td>
<a href={`http://127.0.0.1:5000/download/${doc.filename}`} download>
                  Download
</a>
</td>
</tr>
          ))}
</tbody>
</table>
</div>
  );
};
 
export default HomeUser;
