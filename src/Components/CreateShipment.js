import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../App.css';


export default function CreateShipment() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        invoice_no: '',
        date: '',
        container_no: '',
        from_location: '',
        to_location: '',
        from_address: '',
        to_address: '',
        material_cost: 0,
        transport_cost: 0,
        loading_cost: 0,
        container_cost: 0,
        port_cost: 0,
        customs_charges: 0,
        extra_charges: 0,
        gross_total: 0,
        net_total: 0,
        total_amount_usd: 0
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        // If the field is 'date', validate it
        if (name === 'date') {
            if (!validateDate(value)) {
                setError("Date cannot be in the future.");
                return;
            } else {
                setError(''); // Clear the error if date is valid
            }
        }

        setInputs(prevValues => {
            const updatedValues = { ...prevValues, [name]: value };

            // Calculate totals
            const {
                material_cost,
                transport_cost,
                loading_cost,
                container_cost,
                port_cost,
                customs_charges,
                extra_charges
            } = updatedValues;

            const gross_total = parseFloat(material_cost) + parseFloat(transport_cost) + parseFloat(loading_cost) + parseFloat(container_cost) + parseFloat(port_cost) + parseFloat(customs_charges);
            const net_total = gross_total + parseFloat(extra_charges);

            return {
                ...updatedValues,
                gross_total,
                net_total,
                total_amount_inr: net_total
            };
        });
    };

    // Function to validate that the date is today or in the past
    const validateDate = (selectedDate) => {
        const today = new Date();
        const dateInput = new Date(selectedDate);

        return dateInput <= today;
    };

    const fetchConversionRate = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
            const conversionRate = response.data.rates.USD;
            const totalAmountINR = inputs.net_total;
            const totalAmountUSD = (totalAmountINR * conversionRate).toFixed(2);
            setInputs(values => ({ ...values, total_amount_usd: totalAmountUSD }));
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (error) {
            alert('Please correct the errors before submitting.');
            return;
        }
        axios.post('http://localhost:8080/apii/user/save', inputs).then(response => {
            console.log(response.data);
            navigate('/admin-page');
        });
    };

    return (
        <div>
            <h1>Create Shipment</h1>
            <form onSubmit={handleSubmit}>
                <table cellSpacing="10">
                    <tbody>
                        <tr>
                            <th><label>Invoice_no: </label></th>
                            <td><input type="text" name="invoice_no" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Date: </label></th>
                            <td>
                                <input type="date" name="date" onChange={handleChange} required />
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <th><label>Container_No: </label></th>
                            <td><input type="text" name="container_no" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>From_Location: </label></th>
                            <td><textarea type="text" name="from_location" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>To_Location: </label></th>
                            <td><textarea type="text" name="to_location" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>From_Address: </label></th>
                            <td><textarea type="text" name="from_address" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>To_Address: </label></th>
                            <td><textarea type="text" name="to_address" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Material_Cost: </label></th>
                            <td><input type="number" name="material_cost" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Transport_Cost: </label></th>
                            <td><input type="number" name="transport_cost" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Loading_Cost: </label></th>
                            <td><input type="number" name="loading_cost" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Container_Cost: </label></th>
                            <td><input type="number" name="container_cost" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Port_Cost: </label></th>
                            <td><input type="number" name="port_cost" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Customs Charges: </label></th>
                            <td><input type="number" name="customs_charges" onChange={handleChange} required /></td>
                        </tr>
                        <tr>
                            <th><label>Extra Charges: </label></th>
                            <td><input type="number" name="extra_charges" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <th><label>Gross_Total: </label></th>
                            <td><input type="number" name="gross_total" value={inputs.gross_total} readOnly /></td>
                        </tr>
                        <tr>
                            <th><label>Net_Total: </label></th>
                            <td><input type="number" name="net_total" value={inputs.net_total} readOnly /></td>
                        </tr>
                        <tr>
                            <th><label>Total Amount INR: </label></th>
                            <td><input type="number" name="total_amount_inr" value={inputs.net_total} readOnly /></td>
                        </tr>
                        <tr>
                            <th><label>Total_Amount_USD: </label></th>
                            <td><input type="number" name="total_amount_usd" value={inputs.total_amount_usd} readOnly /></td>
                            <td>
                                <button className="btn" type="button" onClick={fetchConversionRate} required >USD Conversion</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" align="center">
                                <button className="btn" type="submit">Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}
