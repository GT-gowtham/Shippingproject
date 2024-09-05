import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../App.css';


export default function EditShipment() {
    const navigate = useNavigate();
    const { id } = useParams();

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
        total_amount_usd: 0,
        total_amount_inr: 0
    });

    useEffect(() => {
        getUser();
    }, []);

    function getUser() {
        axios.get(`http://localhost:8080/apii/users?&id=${id}`)
            .then(response => {
                setInputs(response.data);
            })
            .catch(error => {
                console.error('Error fetching shipment data:', error);
            });
    }

    useEffect(() => {
        const {
            material_cost,
            transport_cost,
            loading_cost,
            container_cost,
            port_cost,
            customs_charges,
            extra_charges
        } = inputs;

        const grossTotal = (
            parseFloat(material_cost || 0) +
            parseFloat(transport_cost || 0) +
            parseFloat(loading_cost || 0) +
            parseFloat(container_cost || 0) +
            parseFloat(port_cost || 0) +
            parseFloat(customs_charges || 0)
        ).toFixed(2);

        const netTotal = (parseFloat(grossTotal) + parseFloat(extra_charges || 0)).toFixed(2);

        setInputs(prevInputs => ({
            ...prevInputs,
            gross_total: grossTotal,
            net_total: netTotal,
            total_amount_inr: netTotal
        }));
    }, [
        inputs.material_cost,
        inputs.transport_cost,
        inputs.loading_cost,
        inputs.container_cost,
        inputs.port_cost,
        inputs.customs_charges,
        inputs.extra_charges
    ]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = (event.target.value);
        setInputs(values => ({ ...values, [name]: value }));
    };

    const fetchConversionRate = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
            const conversionRate = response.data.rates.USD;
            const totalAmountINR = inputs.total_amount_inr;
            const totalAmountUSD = (totalAmountINR * conversionRate).toFixed(2);
            setInputs(prevValues => ({ ...prevValues, total_amount_usd: totalAmountUSD }));
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`http://localhost:8080/apii/user/${id}/edit`, inputs)
            .then(response => {
                console.log(response.data);
                navigate('/admin-page');
            })
            .catch(error => {
                console.error('Error updating shipment data:', error);
            });
    };

    return (
        <div>
        <h1>Edit Shipment</h1>
        <form onSubmit={handleSubmit}>
            <table cellSpacing="10">
                <tbody>
                    <tr>
                        <th><label>Invoice No: </label></th>
                        <td>
                            <input type="text" name="invoice_no" value={inputs.invoice_no} onChange={handleChange} required readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Date: </label></th>
                        <td>
                            <input type="date" name="date" value={inputs.date} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Container No: </label></th>
                        <td>
                            <input type="text" name="container_no" value={inputs.container_no} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>From Location: </label></th>
                        <td>
                            <textarea type="text" name="from_location" value={inputs.from_location} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>To Location: </label></th>
                        <td>
                            <textarea type="text" name="to_location" value={inputs.to_location} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>From Address: </label></th>
                        <td>
                            <textarea type="text" name="from_address" value={inputs.from_address} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>To Address: </label></th>
                        <td>
                            <textarea type="text" name="to_address" value={inputs.to_address} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Material Cost: </label></th>
                        <td>
                            <input type="number" step="0.01" name="material_cost" value={inputs.material_cost} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Transport Cost: </label></th>
                        <td>
                            <input type="number" step="0.01" name="transport_cost" value={inputs.transport_cost} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Loading Cost: </label></th>
                        <td>
                            <input type="number" step="0.01" name="loading_cost" value={inputs.loading_cost} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Container Cost: </label></th>
                        <td>
                            <input type="number" step="0.01" name="container_cost" value={inputs.container_cost} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Port Cost: </label></th>
                        <td>
                            <input type="number" step="0.01" name="port_cost" value={inputs.port_cost} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Customs Charges: </label></th>
                        <td>
                            <input type="number" step="0.01" name="customs_charges" value={inputs.customs_charges} onChange={handleChange} required />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Extra Charges: </label></th>
                        <td>
                            <input type="number" step="0.01" name="extra_charges" value={inputs.extra_charges} onChange={handleChange} />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Gross Total: </label></th>
                        <td>
                            <input type="number" step="0.01" name="gross_total" value={inputs.gross_total} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Net Total: </label></th>
                        <td>
                            <input type="number" step="0.01" name="net_total" value={inputs.net_total} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Total Amount INR: </label></th>
                        <td>
                            <input type="number" step="0.01" name="total_amount_inr" value={inputs.total_amount_inr} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th><label>Total Amount USD: </label></th>
                        <td>
                            <input type="number" step="0.01" name="total_amount_usd" value={inputs.total_amount_usd} readOnly />
                        </td>
                        <td>
                            <button type="button" onClick={fetchConversionRate}>USD Conversion</button>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="right">
                            <button className="btn" type="submit">Update</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
    );
}
