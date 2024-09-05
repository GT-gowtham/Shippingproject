// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route, } from "react-router-dom";
// import LoginForm from "./Components/LoginForm/LoginForm";
// import Nav from "./Components/Nav";
// import UserPage from "./Components/LoginForm/UserPage";
// import ListShipment from "./Components/Listshipment";
// import CreateShipment from "./Components/CreateShipment";
// import EditShipment from "./Components/EditShipment";

// function App() {


//   return (
//     <>
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<LoginForm />} />
//       <Route path="/admin-page" element={<Nav />}/>
//         <Route path="/admin-page/view" element={<ListShipment/>} />
//         <Route path="/admin-page/create" element={<CreateShipment />} /> 
//         <Route path="user/:id/edit" element={<EditShipment />} /> 
      
//       <Route path="/user-page" element={<UserPage />} />
//     </Routes>
//   </BrowserRouter>
//   </>
//   );
// }

// export default App;


import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import Nav from "./Components/Nav";
import UserPage from "./Components/LoginForm/UserPage";
import ListShipment from "./Components/Listshipment";
import CreateShipment from "./Components/CreateShipment";
import EditShipment from "./Components/EditShipment";

function App() {
  const location = useLocation();

  return (
    <>
       {location.pathname !== "/" && location.pathname !== "/user-page" && <Nav />}
      
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-page" element={<ListShipment />} />
        <Route path="/admin-page/view" element={<ListShipment />} />
        <Route path="/admin-page/create" element={<CreateShipment />} />
        <Route path="/user/:id/edit" element={<EditShipment />} />
        <Route path="/user-page" element={<UserPage />} />
      </Routes>
    </>
  );
}

export default App;

