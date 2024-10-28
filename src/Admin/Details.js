import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Details = () => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/details');
        setDetails(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div>
      <h1>Details Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
          
            <th>Date</th>
            <th>Time</th>
            <th>Filename</th>
            <th>Checklist</th>
            <th>invoice_date</th>
            <th>Gross_Amt</th>
            <th>Payee_Reference</th>
            <th> TDS</th>
            <th>Net_Amt</th>
            {/* Add other columns based on the structure of the details table */}
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.id}>
              <td>{detail.id}</td>
              <td>{detail.date}</td>
              <td>{detail.time}</td>
              <td>{detail.filename}</td>
              <td>{detail.checklist}</td>
              <td>{detail.Inv_Date}</td>
              <td>{detail.Gross_Amt}</td>
              <td>{detail.Payee_Reference}</td>
              <td>{detail.TDS}</td>
              <td>{detail.Net_Amt}</td>
              
           
              {/* Render other fields here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Details;
