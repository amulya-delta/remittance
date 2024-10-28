import os
import subprocess
from flask import Flask, Blueprint, jsonify, send_from_directory, request, send_from_directory
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, verify_jwt_in_request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import mysql.connector
import datetime
from datetime import date
from functools import wraps
from db import engine
from sqlalchemy import text
import bcrypt
import pdfplumber
import re
from dateutil import parser 
from flask import Flask, send_from_directory
import pymysql
from sqlalchemy import create_engine
# Define database configuration
DB_HOST = '127.0.0.1'
DB_NAME = 'invoicedetails'
DB_USER = 'root'
DB_PASS = 'new_password'
# engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}')
db_config = {
    'user': 'root',
    'password': 'new_password',
    'host': '127.0.0.1',
    'database': 'invoicedetails',
}
connection = mysql.connector.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
admin_blp = Blueprint('admin_blp', __name__)
# Create the Flask blueprint for the upload route
upload_blp = Blueprint('upload', __name__)
###################################################### upload api #################################################
def extract_invoice_details(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text()

    # Extracting the required details
    details = {}

    # Extract Document No
    # doc_no_start = text.find("Document No :") + len("Document No :")
    # doc_no_end = text.find("\n", doc_no_start)
    # details['Document No'] = text[doc_no_start:doc_no_end].strip()
    ###################################################################################################
    # doc_no_match = re.search(r"Document No :\s*([A-Za-z0-9\-]+)", text)
    # if doc_no_match:
    #     details['Document No'] = doc_no_match.group(1).strip()
    # else:
    #     raise ValueError("Document No not found")
    ##############################################################################################
    # #Extract Document NO
    ##Extract Document No (with variations)
    doc_no_match = re.search(r"Document No :\s*([A-Za-z0-9\-]+)", text)
    if doc_no_match:
        details['Document No'] = doc_no_match.group(1).strip()
    else:
        raise ValueError("Document No not found")

###############################################################
    # Extract Name (LTD)
    name_start = text.find("Name :") + len("Name :")
    name_end = text.find("\n", name_start)
    details['Name'] = text[name_start:name_end].strip()

    # Extract PO Number
    po_start = text.find("PO Number :") + len("PO Number :")
    po_end = text.find("\n", po_start)
    details['PO Number'] = text[po_start:po_end].strip()

    # Extract Description
    desc_start = text.find("Description :") + len("Description :")
    desc_end = text.find("\n", desc_start)
    details['Description'] = text[desc_start:desc_end].strip()

    # Extract Document Date
    doc_date_start = text.find("Document Date :") + len("Document Date :")
    doc_date_end = text.find("\n", doc_date_start)
    document_date = text[doc_date_start:doc_date_end].strip()
    day, month, year = document_date.split('-')
    details['Document Date'] = f"{year}-{month}-{day}"
    # Extract Assessable Value or Total Value in INR
    assessable_value = None

    assessable_value_start = text.find("Assessable Value :")
    if assessable_value_start > 0:
        assessable_value_start += len("Assessable Value :")
        assessable_value_end = text.find("\n", assessable_value_start)
        assessable_value_text = text[assessable_value_start:assessable_value_end].strip()
        assessable_value = assessable_value_text
 
    if not assessable_value:
        total_value_start = text.find("Total Value in INR :")
        if total_value_start != -1:
            total_value_start += len("Total Value in INR :")
            total_value_end = text.find("\n", total_value_start)
            total_value_text = text[total_value_start:total_value_end].strip()


            assessable_value = total_value_text
 
    if assessable_value:
        details['Assessable Value'] = assessable_value
    else:
        raise ValueError("Neither Assessable Value nor Total Value in INR found or they are not valid numbers.")
 
    # Extract Assessable Value
    # assessable_value_start = text.find("Assessable Value :") + len("Assessable Value :")
    # assessable_value_end = text.find("\n", assessable_value_start)
    # details['Assessable Value'] = text[assessable_value_start:assessable_value_end].strip()
    # print(details)
    return details

import pdfplumber
import re
def extract_data_from_pdf(pdf_path):
    # Open the PDF
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]  # Assuming the data is on the first page
        text = page.extract_text()

        # Debugging: Print the extracted text
        print("Extracted Text:\n", text)

        # Regex pattern to capture Payee Reference, Inv. Date, optional GSTN, Gross Amt, TDS, Net Amt
        row_pattern = re.compile(
            r'([A-Z0-9-]+)\s+(\d{2} \w{3} \d{4})\s+(?:([A-Z0-9]+)\s+)?([-,\d]+\.\d{2})\s+([-,\d]+\.\d{2})\s+([-,\d]+\.\d{2})'
        )

        # Find all matches for rows
        rows = row_pattern.findall(text)

        # Check if there's at least one match and convert to key-value pair format
        if rows:
            extracted_data = [
                {
                    "Payee Reference": payee_ref,
                    "Inv. Date": inv_date,
                    "GSTN": gstn if gstn else "N/A",  # GSTN might be None, so use "N/A" if missing
                    "Gross Amt": float(gross_amt.replace(',', '')),
                    "TDS": float(tds.replace(',', '')),
                    "Net Amt": float(net_amt.replace(',', ''))
                }
                for payee_ref, inv_date, gstn, gross_amt, tds, net_amt in rows
            ]
        else:
            extracted_data = []

        print("Extracted Data:", extracted_data)

        # Extract Total (Net Amt) using regex
        total_match = re.search(r'Total\s+([\d,]+\.\d{2})', text)
        total_amount = float(total_match.group(1).replace(',', '')) if total_match else None

        # Extract Payment Reference Number using regex
        payment_ref_match = re.search(r'payment reference number\s+(\d+)', text, re.IGNORECASE)
        payment_ref = payment_ref_match.group(1) if payment_ref_match else None

        # Extract Value Date (Remittance Date)
        value_date_match = re.search(r'Value Date\s*:\s*(\d{2} \w{3} \d{4})', text)
        value_date = value_date_match.group(1) if value_date_match else None

        return {
            "extracted_data": extracted_data,  # List of dictionaries (dynamic number of rows)
            "total_amount": total_amount,
            "payment_ref": payment_ref,
            "value_date": value_date
        }
def process_payment(data):
    payee_reference=data["payee_reference"]
    invoice_date = datetime.datetime.strptime(data["invoice_date"], '%d %b %Y').date()
    total_amount = data["total_amount"]
    payment_ref = data["payment_ref"]
    value_date = datetime.datetime.strptime(data["value_date"], '%d %b %Y').date()

    try:
        with connection.cursor() as cursor:
            # Match the invoice date in the database
            sql = "SELECT * FROM invoices WHERE invoice_number = %s"
            cursor.execute(sql, (payee_reference,))
            result = cursor.fetchone()

            if result:
                received_amount = total_amount  # Use total_amount for received_amount

                # Update payment status, remittance details, and received_amount
                update_sql = """
                    UPDATE invoices 
                    SET payment_status = 'Paid', remittance_date = %s, reference_number = %s, received_amount = %s
                    WHERE invoice_number = %s
                """
                cursor.execute(update_sql, (value_date, payment_ref, received_amount, payee_reference))
                connection.commit()
                return {"status": "success", "message": f"Payment for Invoice Date {payee_reference} processed successfully"}
            else:
                return {"status": "error", "message": "No matching invoice found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        connection.close()
###############################################################################################################
def insert_invoice_to_db(details):
    connection = mysql.connector.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    cursor = connection.cursor()
    # try:
    #     document_date = datetime.datetime.strptime(details['Document Date'], '%d-%m-%Y').date()
    # except ValueError as e:
    #     raise ValueError(f"Date format error: {e}")
    # Convert assessable_value to float for calculations
    formatted_assessable_value = float(details['Assessable Value'].replace(',', ''))

    # Calculate required values
    igst_tax_amount = formatted_assessable_value * 0.18
    total_invoice_value = formatted_assessable_value + igst_tax_amount
    tds_value = formatted_assessable_value * 0.10
    receivable_amount = (formatted_assessable_value - tds_value + igst_tax_amount)

    # Insert into database
    cursor.execute("""
        INSERT INTO Invoices (
            invoice_date, po_number, party_name, description, 
            invoice_number, taxable_value, igst_amount, 
            total_invoice_value, tds_amount, receivable_amount, 
            payment_status
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        details["Document Date"],
        details['PO Number'],
        details['Name'],
        details['Description'],
        details['Document No'],
        formatted_assessable_value,
        igst_tax_amount,
        total_invoice_value,
        tds_value,
        receivable_amount,
        'Unpaid'  # Default payment status
    ))

    connection.commit()
    cursor.close()
    connection.close()
def extract_invoice_data_SM(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            # Extract Invoice Number
            invoice_no = re.search(r'INVOICE #\s*(\S+)', text)
            invoice_no = invoice_no.group(1) if invoice_no else "Not found"
            # Extract Invoice Date
            invoice_date = re.search(r'Invoice date\s*(\d{2}-\d{2}-\d{4})', text)
            invoice_date = invoice_date.group(1) if invoice_date else "Not found"
            day, month, year = invoice_date.split('-')
            invoice_date = f"{year}-{month}-{day}"
            print(invoice_date)
            # Extract P.O. Number
            po_no = re.search(r'P\.O\. No\s*(\d+)', text)
            po_no = po_no.group(1) if po_no else "Not found"
            # Extract Description
            description = re.search(r'DESCRIPTION\s*(.*?)(\d{2}-\d{2}-\d{4})', text, re.DOTALL)
            description = description.group(1).strip() if description else "Not found"
            # Extract Amount (Subtotal)
            amount = re.search(r'SUBTOTAL\s*([\d,]+\.\d{2})', text)
            amount = amount.group(1) if amount else "Not found"
            
            # Return the extracted data
            return {
                'Document No': invoice_no,
                'Document Date': invoice_date,
                'PO Number': po_no,
                'Description': description,
                'Assessable Value': amount,
                'Name':"JOHN DEERE INDIA PRIVATE LTD"
            }
        from datetime import datetime
def extract_invoice_data_waybill(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        text = page.extract_text()

        # Initialize variables
        document_no = None
        document_date = None
        value_of_goods = None

        # Split the text into lines for processing
        for line in text.split('\n'):
            if 'Document No.' in line:
                document_no = line.split('Document No.')[1].strip()
            elif 'Document Date' in line:
                document_date = line.split('Document Date')[1].strip().replace('/', '-')
                document_date = document_date
                day, month, year = document_date.split('-')
                document_date = f"{year}-{month}-{day}"
                print(document_date)
            elif 'Value of Goods' in line:
                value_of_goods = line.split('Value of Goods')[1].strip()


        # Return extracted details
        return {
            'Document No': document_no,
            'Document Date': document_date,
            'Assessable Value': value_of_goods,
            'Name':"JOHN DEERE INDIA PRIVATE LTD",
            'Description': "None",
            'PO Number':"None"
        }
#######################################################################################################
@upload_blp.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    selected_option = request.form.get('selectedOption')

    # Save the file temporarily
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file.save(pdf_path)

    if selected_option == "Invoice Upload":
        try:
               # Check if 'S&M' is in the filename
            if 'S&M_Breakup' in file.filename:
                # Use extract_invoice_data_1 function if the condition is met
                details = extract_invoice_data_SM(pdf_path)
                invoice_number = details['Document No']
                # Check if the invoice is already in the database
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM Invoices WHERE invoice_number = %s", (invoice_number,))
                    existing_invoice = cursor.fetchone()

                if existing_invoice:
                    return jsonify({'error': 'Invoice already exists in the database'}), 409  # HTTP 409 Conflict

                # Insert the data into the database
                insert_invoice_to_db(details)
                return jsonify({'message': 'Invoice details inserted successfully'}), 200

            elif 'Invoice_WayBill' in file.filename:
                details = extract_invoice_data_waybill(pdf_path)
                invoice_number = details['Document No']

                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM Invoices WHERE invoice_number = %s", (invoice_number,))
                    existing_invoice = cursor.fetchone()

                if existing_invoice:
                    return jsonify({'error': 'Invoice already exists in the database'}), 409  # HTTP 409 Conflict
                insert_invoice_to_db(details)
                return jsonify({'message': 'Invoice details inserted successfully'}), 200

            else:
                # If 'S&M' is not in the filename, use the regular extract_invoice_details function
                details = extract_invoice_details(pdf_path)
                invoice_number = details['Document No']
                # Check if the invoice is already in the database
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM Invoices WHERE invoice_number = %s", (invoice_number,))
                    existing_invoice = cursor.fetchone()

                if existing_invoice:
                    return jsonify({'error': 'Invoice already exists in the database'}), 409  # HTTP 409 Conflict

                # Insert the data into the database
                insert_invoice_to_db(details)
                return jsonify({'message': 'Invoice details inserted successfully'}), 200

        except Exception as e:
            print({'error': str(e)})
            return jsonify({'error': str(e)}), 500

    elif selected_option == "Remittance Advice Upload":
        try:
            data = extract_data_from_pdf(pdf_path)
            extracted_data = data["extracted_data"]
            payment_ref = data["payment_ref"]
            # value_date = data["value_date"]
            value_date = datetime.datetime.strptime(data["value_date"], '%d %b %Y').date()
            total_amount = data["total_amount"]

            for row in extracted_data:
                # payee_reference = 'DT-2425-09-0813'  # Modify this as needed
                payee_reference=row['Payee Reference']
                gross_amount = row['Gross Amt']
                tds_amount = row['TDS']
                net_amount = row['Net Amt']

                with conn.cursor() as cursor:
                    cursor.execute("SELECT * FROM invoices WHERE invoice_number = %s", (payee_reference,))
                    invoice = cursor.fetchone()

                    if invoice:
                        # Convert receivable_amount to float
                        receivable_amount = float(invoice['receivable_amount'])  # Ensure this is float

                        received_amount = net_amount  # Net amount can be float

                        # Calculate difference_amount and set payment_status
                        difference_amount = received_amount - receivable_amount
                        payment_status = 'Paid' if difference_amount == 0 else 'Difference'

                        # Update the invoice with remittance details and received amount
                        cursor.execute(""" 
                            UPDATE invoices 
                            SET received_amount = %s, tds_on_second_check = %s, difference_amount = %s, 
                                payment_status = %s, remittance_date = %s, remittance_number = %s 
                            WHERE invoice_number = %s
                        """, (
                            received_amount, tds_amount, difference_amount, payment_status, 
                            value_date, payment_ref, payee_reference
                        ))
                        conn.commit()
                    else:
                        print({'error': f"No matching invoice found for Payee Reference: {payee_reference}"})
                        return jsonify({'error': f"No matching invoice found for Payee Reference: {payee_reference}"}), 404

            return jsonify({'message': 'Remittance details processed successfully'}), 200
        except Exception as e:
                print({'error': str(e)})
                return jsonify({'error': str(e)}), 500

##############################################to show data####################
@upload_blp.route('/invoices', methods=['GET'])
def get_invoices():
    try:
        cursor = conn.cursor()  # Fetch as dictionaries
        cursor.execute("SELECT id, invoice_date, po_number, party_name, description, invoice_number, taxable_value, igst_amount, total_invoice_value, tds_amount, receivable_amount, received_amount, tds_on_second_check, difference_amount, payment_status, remittance_date, remittance_number, due_date FROM invoices")  # Query to fetch all invoices
        invoices = cursor.fetchall()  # Fetch all results
        # print(invoices)
        cursor.close()

        formatted_invoices = []
        for invoice in invoices:
            formatted_invoices.append({
                "id": invoice['id'],
                "invoice_date": invoice['invoice_date'],
                "po_number": invoice['po_number'],
                "party_name": invoice['party_name'],
                "description": invoice['description'],
                "invoice_number": invoice['invoice_number'],
                "taxable_value": invoice['taxable_value'],
                "igst_amount": invoice['igst_amount'],
                "total_invoice_value": invoice['total_invoice_value'],
                "tds_amount": invoice['tds_amount'],
                "receivable_amount": invoice['receivable_amount'],
                "received_amount": invoice['received_amount'],
                "tds_on_second_check": invoice['tds_on_second_check'],
                "difference_amount": invoice['difference_amount'],
                "payment_status": invoice['payment_status'],
                "remittance_date": invoice['remittance_date'],
                "remittance_number": invoice['remittance_number'],
                "due_date": invoice['due_date']
            })

        # print(formatted_invoices)
        return jsonify(formatted_invoices)  # Return the results as JSON

    except Exception as e:
        print({"error": str(e)})
        return jsonify({"error": str(e)}), 500  # Handle any errors

 ######################################## get method    #######################################################
@upload_blp.route('/check-po-number', methods=['GET'])
def check_po_number():
    po_number = request.args.get('po_number')
    if not po_number:
        return jsonify({'error': 'PO number is required'}), 400

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if a record with the same PO number exists
        check_query = "SELECT COUNT(*) FROM documents WHERE po_number = %s"
        cursor.execute(check_query, (po_number,))
        count = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return jsonify({'exists': count > 0})

    except mysql.connector.Error as error:
        print({'error': f"Failed to check PO number in MySQL table {error}"})
        return jsonify({'error': f"Failed to check PO number in MySQL table {error}"}), 500
##########################################################################################################
@upload_blp.route('/details', methods=['GET'])
def get_details():
    try:
        # Establish database connection
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # SQL query to fetch details
        query = """
        SELECT Payee_Reference, Inv_Date, GSTN, Gross_Amt, TDS, Net_Amt, 
               id, date, time, filename, filedata, checklist, filepath
        FROM details
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        # Format date and time
        for row in rows:
            if isinstance(row['Inv_Date'], datetime.date):
                row['Inv_Date'] = row['Inv_Date'].strftime('%Y-%m-%d')
            if isinstance(row['date'], datetime.date):
                row['date'] = row['date'].strftime('%Y-%m-%d')
            if isinstance(row['time'], (datetime.time, datetime.timedelta)):
                row['time'] = str(row['time'])

            # Convert bytes to a string or handle it appropriately
            if isinstance(row['filedata'], bytes):
                row['filedata'] = row['filedata'].decode('utf-8', errors='ignore')  # Adjust as needed

        # Close the cursor and connection
        cursor.close()
        connection.close()

        # Return the fetched details as JSON
        return jsonify(rows)

    except mysql.connector.Error as error:
        # Handle any database connection or query execution errors
        return jsonify({'error': f"Failed to fetch records from MySQL table: {error}"}), 500

 ###########################################################################################################

##################################################### GET API ########################################
@upload_blp.route('/documents', methods=['GET'])
def get_documents():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, date, time, filename, checklist, filepath,serial_number,acknowledgement_date, po_number, party_name,description,document_number,taxable_value,igst_tax_amount,total_invoice_value,tds_percent, tds_value,receivable_amount FROM documents")
        rows = cursor.fetchall()
        for row in rows:
            if isinstance(row['date'], datetime.date):
                row['date'] = row['date'].strftime('%Y-%m-%d')
            if isinstance(row['time'], (datetime.time, datetime.timedelta)):
                row['time'] = str(row['time'])
        cursor.close()
        connection.close()
        return jsonify(rows)
    except mysql.connector.Error as error:
        return jsonify({'error': f"Failed to fetch records from MySQL table {error}"}), 500

@upload_blp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    upload_folder = os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER'])
    return send_from_directory(upload_folder, filename, as_attachment=True)

@upload_blp.route('/documents/<int:id>', methods=['PUT'])
def update_document(id):
    data = request.json
    update_fields = []

    if 'date' in data:
        update_fields.append(f"date='{data['date']}'")
    if 'time' in data:
        update_fields.append(f"time='{data['time']}'")
    if 'filename' in data:
        update_fields.append(f"filename='{data['filename']}'")
    if 'checklist' in data:
        update_fields.append(f"checklist='{data['checklist']}'")
    if 'filepath' in data:
        update_fields.append(f"filepath='{data['filepath']}'")

    if not update_fields:
        return jsonify({'error': 'No fields to update'}), 400

    update_str = ", ".join(update_fields)

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        sql_update_query = f"UPDATE documents SET {update_str} WHERE id={id}"
        cursor.execute(sql_update_query)
        connection.commit()
        cursor.close()
        connection.close()
    except mysql.connector.Error as error:
        return jsonify({'error': f"Failed to update record in MySQL table {error}"}), 500

    return jsonify({'message': 'Document updated successfully'}), 200


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_role = get_jwt_identity()
            if current_user_role["role"] != 'admin':
                return jsonify({'message': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Error occurred during admin validation', 'error': str(e)}), 500
    return wrapper

###################################### user login ##############################
@admin_blp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'RACF_ID' not in data or 'password' not in data:
            return jsonify({"message": "Missing RACF_ID or password"}), 422

        racf_id = data.get('RACF_ID')
        password = data.get('password')
        # Execute SQL query using SQLAlchemy engine
        with engine.connect() as connection:
            sql = text("SELECT `RACF ID`, `password`, `is_admin`, `is_active` FROM users WHERE `RACF ID` = :racf_id")
            result = connection.execute(sql, {'racf_id': racf_id})
            user = result.fetchone()
        # print(user)
        if user:
            stored_password = user[1]
            if bcrypt.checkpw(password.encode(), stored_password.encode()):
                if user[2] and user[3]:
                    access_token = create_access_token(identity={"RACF_ID": racf_id, "role": "admin"})
                    return jsonify({"message": "Login successful", "token": access_token}), 200
                else:
                    return jsonify({"message": "Admin access required"}), 400
            else:
                return jsonify({"message": "Invalid Credentials"}), 400
        else:
            return jsonify({"message": "Invalid Credentials"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500




user_blp = Blueprint('user_blp', __name__)

def employee_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()  # Verify JWT token in the request
            current_user_role = get_jwt_identity()
            if current_user_role["role"] != 'employee':
                return jsonify({'message': 'Employee access required'}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Error occurred during Employee validation', 'error': str(e)}), 500
    return wrapper

@user_blp.route('/user_login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'RACF_ID' not in data or 'password' not in data:
            return jsonify({"message": "Missing RACF_ID or password"}), 422

        racf_id = data.get('RACF_ID')
        password = data.get('password')

        # Execute SQL query using SQLAlchemy engine
        with engine.connect() as connection:
            sql = text("SELECT `RACF ID`, `password`, `is_admin`, `is_active` FROM users WHERE `RACF ID` = :racf_id")
            result = connection.execute(sql, {'racf_id': racf_id})
            user = result.fetchone()
        # print(user)
        if user:
            stored_password = user[1]
            if bcrypt.checkpw(password.encode(), stored_password.encode()):
                if user[3] and not user[2]:
                    access_token = create_access_token(identity={"RACF_ID": racf_id, "role": "employee"})
                    return jsonify({"message": "Login successful", "token": access_token}), 200
                else:
                    return jsonify({"message": "Invalid or Inactive user"}), 400
            else:
                return jsonify({"message": "Invalid Credentials"}), 400
        else:
            return jsonify({"message": "Invalid Credentials"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500



def create_employee_app(db_url=None):
    app = Flask(__name__, static_folder='build', static_url_path='/')
    JWTManager(app)
    CORS(app, supports_credentials=True)
    app.config["SECRET_KEY"] = "my_324h3d_k3y"
    app.config["JWT_SECRET_KEY"] = "my_r2nd0m_k3y"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # Token expires in 1 hour
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.register_blueprint(admin_blp)
    app.register_blueprint(user_blp)
    app.register_blueprint(upload_blp)  # Register the upload blueprint
    @app.route('/')
    def serve_react_app():
        return send_from_directory(app.static_folder, 'index.html')

    # Fallback route to serve index.html for any other routes (React Router handling)
    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    return app
if __name__ == "__main__":
    app = create_employee_app()
    app.run(debug=True)
