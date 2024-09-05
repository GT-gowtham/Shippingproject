import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [startDate, setStartDate] = useState(getPreviousDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 10; 
    const navigate = useNavigate();
    useEffect(() => {
      getUsers();
  }, [startDate, endDate, currentPage]);

  function getPreviousDate() {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  }

  function getCurrentDate() {
      return new Date().toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  }

  function getUsers() {
      axios.get(`http://localhost:8080/api1/users?start_date=${startDate}&end_date=${endDate}&page=${currentPage}&limit=${rowsPerPage}`)
          .then(function(response) {
              console.log(response.data);
              setUsers(response.data.users);
              setTotalPages(response.data.totalPages); // Assuming your API returns total pages
          })
          .catch(error => console.error('Error fetching users:', error));
  }

  
  const nextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
};

const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="table-container">
            <h2>List Shipments</h2>

            <div>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date: </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="filter-button" onClick={getUsers}>Filter</button>
                <button className="filter-button" onClick={() => { setStartDate(getPreviousDate()); setEndDate(getCurrentDate()); setCurrentPage(1); }}>Reset</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>SL.NO</th>
                        <th>Invoice_no</th>
                        <th>Date</th>
                        <th>Created On</th>
                        <th>Container_No</th>
                        <th>From_Location</th>
                        <th>To_Location</th>
                        <th>From_Address</th>
                        <th>To_Address</th>
                        <th>Material_Cost</th>
                        <th>Transport_Cost</th>
                        <th>Loading_Cost</th>
                        <th>Container_Cost</th>
                        <th>Port_Cost</th>
                        <th>Customs_Cost</th>
                        <th>Gross_Total</th>
                        <th>Net_Total</th>
                        <th>Total_Amount_INR</th>
                        <th>Total_Amount_USD</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, key) => (
                        <tr key={key}>
                            <td>{user.id}</td>
                            <td>{user.invoice_no}</td>
                            <td>{user.date}</td>
                            <td>{user.created_at}</td>
                            <td>{user.container_no}</td>
                            <td>{user.from_location}</td>
                            <td>{user.to_location}</td>
                            <td>{user.from_address}</td>
                            <td>{user.to_address}</td>
                            <td>{user.material_cost}</td>
                            <td>{user.transport_cost}</td>
                            <td>{user.loading_cost}</td>
                            <td>{user.container_cost}</td>
                            <td>{user.port_cost}</td>
                            <td>{user.customs_charges}</td>
                            <td>{user.gross_total}</td>
                            <td>{user.net_total}</td>
                            <td>{user.total_amount_inr}</td>
                            <td>{user.total_amount_usd}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button className="pagination-button" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

