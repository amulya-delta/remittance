// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import "./Home.css"
 
// const ShowData = () => {
//   const [documents, setDocuments] = useState([]);
//   const [editMode, setEditMode] = useState(null);
//   const [editData, setEditData] = useState({});
 
//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:5000/documents');
//         setDocuments(response.data);
//       } catch (error) {
//         console.error('Error fetching documents:', error);
//       }
//     };
 
//     fetchDocuments();
//   }, []);
 
//   const handleEditClick = (id, doc) => {
//     setEditMode(id);
//     setEditData(doc);
//   };
 
//   const handleSaveClick = async (id) => {
//     try {
//       await axios.put(`http://127.0.0.1:5000/documents/${id}`, editData);
//       alert('Document updated successfully');
//       setEditMode(null);
//       setDocuments((prevDocs) =>
//         prevDocs.map((doc) => (doc.id === id ? { ...doc, ...editData } : doc))
//       );
//     } 
//    catch (error) {
//       console.error('Error updating document:', error);
//       alert('Error updating document');
//     }
//   };
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
 
//   return (
// <div>
// <h1>Uploaded Documents</h1>
// <table>
// <thead>
// <tr>
// <th>ID</th>
// <th>Date</th>
// <th>Time</th>
// <th>Filename</th>
// <th>Checklist</th>
// <th>Serial_number</th>
// <th>Acknowledgement Date</th>
// <th>PO_number</th>
// <th>Party_name</th>
// <th>Description</th>
// <th>Document_Number</th>
// <th>Taxable_Value</th>
// <th>igst_tax_amount</th>
// <th>total_invoice_value</th>
// <th>tds_percent</th>
// <th>tds_value</th>
// <th>receivable_amount</th>
// <th>Download</th>
// <th>Actions</th>
// </tr>
// </thead>
// <tbody>
//           {documents.map((doc) => (
// <tr key={doc.id}>
// <td>{doc.id}</td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="date"
//                     name="date"
//                     value={editData.date}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.date
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="time"
//                     name="time"
//                     value={editData.time}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.time
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="filename"
//                     value={editData.filename}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.filename
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="checklist"
//                     value={editData.checklist}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.checklist
//                 )}
// </td>


// {/* <td>
// <a href={`http://127.0.0.1:5000/download/${doc.filename}`} download>
//                   Download
// </a>
// </td>

// <td>
//                 {editMode === doc.id ? (
// <button onClick={() => handleSaveClick(doc.id)}>Save</button>
//                 ) : (
// <button onClick={() => handleEditClick(doc.id, doc)}>Edit</button>
//                 )}
// </td> */}

// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="serial_number"
//                     value={editData.serial_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.serial_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="acknowledgement_date"
//                     value={editData.acknowledgement_date}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.acknowledgement_date
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="po_number"
//                     value={editData.po_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.po_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="party_name"
//                     value={editData.party_name}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.party_name
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="description"
//                     value={editData.description}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.description
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="document_number"
//                     value={editData.document_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.document_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="taxable_value"
//                     value={editData.taxable_value}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.taxable_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="igst_tax_amount"
//                     value={editData.igst_tax_amount}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.igst_tax_amount
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="total_invoice_value"
//                     value={editData.total_invoice_value}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.total_invoice_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="tds_percent"
//                     value={editData.tds_percent}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.tds_percent
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="tds_value"
//                     value={editData.tds_value}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.tds_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="receivable_amount"
//                     value={editData.receivable_amount}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.receivable_amount
//                 )}
// </td>
// <td>
// <a href={`http://127.0.0.1:5000/download/${doc.filename}`} download>
//                   Download
// </a>
// </td>

// <td>
//                 {editMode === doc.id ? (
// <button onClick={() => handleSaveClick(doc.id)}>Save</button>
//                 ) : (
// <button onClick={() => handleEditClick(doc.id, doc)}>Edit</button>
//                 )}
// </td>
// </tr>
//           ))}
// </tbody>
// </table>
// </div>
//   );
// };
 
// export default ShowData;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import "./Home.css";
// import "./Modal.css"
// import Modal from 'react-modal';
 
// const ShowData = () => {
//   const [documents, setDocuments] = useState([]);
//   const [editMode, setEditMode] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [currentEditId, setCurrentEditId] = useState(null);
 
//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:5000/documents');
//         setDocuments(response.data);
//       } catch (error) {
//         console.error('Error fetching documents:', error);
//       }
//     };
 
//     fetchDocuments();
//   }, []);
 
//   const handleEditClick = (id, doc) => {
//     setEditMode(id);
//     setEditData(doc);
//   };
 
//   const handleSaveClick = (id) => {
//     setCurrentEditId(id);
//     setShowConfirmation(true);
//   };
 
//   const confirmSaveClick = async () => {
//     try {
//       await axios.put(`http://127.0.0.1:5000/documents/${currentEditId}`, editData);
//       alert('Document updated successfully');
//       setEditMode(null);
//       setDocuments((prevDocs) =>
//         prevDocs.map((doc) => (doc.id === currentEditId ? { ...doc, ...editData } : doc))
//       );
//       setShowConfirmation(false);
//     } catch (error) {
//       console.error('Error updating document:', error);
//       alert('Error updating document');
//       setShowConfirmation(false);
//     }
//   };
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
 
//   const closeModal = () => {
//     setShowConfirmation(false);
//     setCurrentEditId(null);
//   };
 
//   return (
// <div>
// <h1>Uploaded Documents</h1>
// <table>
// <thead>
// <tr>
// <th>ID</th>
// <th>Date</th>
// <th>Time</th>
// <th>Filename</th>
// <th>Checklist</th>

// <th>Serial_number</th>
// <th>Acknowledgement Date</th>
// <th>PO_number</th>
// <th>Party_name</th>
// <th>Description</th>
// <th>Document_Number</th>
// <th>Taxable_Value</th>
// <th>igst_tax_amount</th>
// <th>total_invoice_value</th>
// <th>tds_percent</th>
// <th>tds_value</th>
// <th>receivable_amount</th>
// <th>Download</th>
// <th>Actions</th>
// </tr>
// </thead>
// <tbody>
//           {documents.map((doc) => (
// <tr key={doc.id}>
// <td>{doc.id}</td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="date"
//                     name="date"
//                     value={editData.date}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.date
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="time"
//                     name="time"
//                     value={editData.time}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.time
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="filename"
//                     value={editData.filename}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.filename
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="checklist"
//                     value={editData.checklist}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.checklist
//                 )}
// </td>
// {/* <td>
// <a href={`http://127.0.0.1:5000/download/${doc.filename}`} download>
//                   Download
// </a>
// </td>
// <td>
//                 {editMode === doc.id ? (
// <button onClick={() => handleSaveClick(doc.id)}>Save</button>
//                 ) : (
// <button onClick={() => handleEditClick(doc.id, doc)}>Edit</button>
//                 )}
// </td> */}
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="serial_number"
//                     value={editData.serial_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.serial_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="acknowledgement_date"
//                     value={editData.acknowledgement_date}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.acknowledgement_date
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="po_number"
//                     value={editData.po_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.po_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="text"
//                     name="party_name"
//                     value={editData.party_name}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.party_name
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="description"
//                     value={editData.description}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.description
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="document_number"
//                     value={editData.document_number}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.document_number
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="taxable_value"
//                     value={editData.taxable_value}
//                    onChange={handleChange}
//                   />
//                 ) : (
//                   doc.taxable_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="igst_tax_amount"
//                     value={editData.igst_tax_amount}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.igst_tax_amount
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="total_invoice_value"
//                     value={editData.total_invoice_value}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.total_invoice_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="tds_percent"
//                     value={editData.tds_percent}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.tds_percent
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="tds_value"
//                     value={editData.tds_value}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.tds_value
//                 )}
// </td>
// <td>
//                 {editMode === doc.id ? (
// <input
//                     type="number"
//                     name="receivable_amount"
//                     value={editData.receivable_amount}
//                     onChange={handleChange}
//                   />
//                 ) : (
//                   doc.receivable_amount
//                 )}
// </td>
// <td>
// <a href={`http://127.0.0.1:5000/download/${doc.filename}`} download>
//                   Download
// </a>
// </td>
// <td>
//                 {editMode === doc.id ? (
// <button onClick={() => handleSaveClick(doc.id)}>Save</button>
//                 ) : (
// <button onClick={() => handleEditClick(doc.id, doc)}>Edit</button>
//                 )}
// </td>
// </tr>
//           ))}
// </tbody>
// </table>
 
//       <Modal
//         isOpen={showConfirmation}
//         onRequestClose={closeModal}
//         contentLabel="Confirmation"
//         className="modal"
//         overlayClassName="overlay"
// >
// <h2>Confirm Save</h2>
// <p>Are you sure you want to save the changes?</p>
// <button onClick={confirmSaveClick}>Yes</button>
// <button onClick={closeModal}>No</button>
// </Modal>
// </div>
//   );
// };
 
// export default ShowData;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import xlsx library

const ShowData = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/invoices'); // Update the URL as necessary
        setInvoices(response.data);
      } catch (err) {
        setError('Error fetching invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Function to determine the cell's background color based on payment status
  const getRowStyle = (status) => {
    switch (status.toLowerCase()) {
        case 'paid':
            return { backgroundColor: 'lightgreen' }; // Green for paid invoices
        case 'unpaid':
            return { backgroundColor: 'lightcoral' }; // Red for unpaid invoices
        case 'difference':
            return { backgroundColor: 'lightyellow' }; // Yellow for difference
        default:
            return {}; // No special background color for other statuses
    }
};

  const exportToExcel = () => {
    // Define the column order
    const orderedInvoices = invoices.map(invoice => ({
      ID: invoice.id,
      'Invoice Date': new Date(invoice.invoice_date).toLocaleDateString(),
      'PO Number': invoice.po_number,
      'Party Name': invoice.party_name,
      'Description': invoice.description,
      'Invoice Number': invoice.invoice_number,
      'Taxable Value': invoice.taxable_value,
      'IGST Amount': invoice.igst_amount,
      'Total Invoice Value': invoice.total_invoice_value,
      'TDS Amount': invoice.tds_amount,
      'Receivable Amount': invoice.receivable_amount,
      'Received Amount': invoice.received_amount,
      'TDS on Second Check': invoice.tds_on_second_check,
      'Payment Status': invoice.payment_status,
      'Remittance Date': invoice.remittance_date ? new Date(invoice.remittance_date).toLocaleDateString() : 'N/A',
      'Remittance Number': invoice.remittance_number,
      // 'Due Date': invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(orderedInvoices); // Convert ordered JSON data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices"); // Append the worksheet to the workbook
    XLSX.writeFile(workbook, "InvoicesData.xlsx"); // Generate Excel file with a specific name
  };

  return (
    <div>
      <h1>Invoices</h1>
      <button onClick={exportToExcel}>Export to Excel</button> {/* Export button */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice Date</th>
            <th>PO Number</th>
            <th>Party Name</th>
            <th>Description</th>
            <th>Invoice Number</th>
            <th>Taxable Value</th>
            <th>IGST Amount</th>
            <th>Total Invoice Value</th>
            <th>TDS Amount</th>
            <th>Receivable Amount</th>
            <th>Received Amount</th>
            <th>TDS on Second Check</th>
            <th>Payment Status</th>
            <th>Remittance Date</th>
            <th>Remittance Number</th>
            {/* <th>Due Date</th> */}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} style={getRowStyle(invoice.payment_status)}>
              <td>{invoice.id}</td>
              <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
              <td>{invoice.po_number}</td>
              <td>{invoice.party_name}</td>
              <td>{invoice.description}</td>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.taxable_value}</td>
              <td>{invoice.igst_amount}</td>
              <td>{invoice.total_invoice_value}</td>
              <td>{invoice.tds_amount}</td>
              <td>{invoice.receivable_amount}</td>
              <td>{invoice.received_amount}</td>
              <td>{invoice.tds_on_second_check}</td>
              <td>{invoice.payment_status}</td> {/* Apply style here */}
              <td>{invoice.remittance_date ? new Date(invoice.remittance_date).toLocaleDateString() : 'N/A'}</td>
              <td>{invoice.remittance_number}</td>
              {/* <td>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowData;
