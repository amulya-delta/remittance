import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Admin/Login";
import LoginUser from "./User/LoginUser";
import Home from "./Admin/Home";
import HomeUser from "./User/HomeUser";
import Navbar from "./Navbar";
import ShowData from "./Admin/ShowData";
import Details from "./Admin/Details";

const App = () => {
  const [user, setUser] = useState(null);
  const [empuser, setEmpUser] = useState(null);
  const [racfId, setRacfId] = useState("");
  const [activePortal, setActivePortal] = useState(null);
  const [db, setDb] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedEmpUser = localStorage.getItem("empuser");
    const savedRacfId = localStorage.getItem("racfId");
    const SvaedDB = localStorage.getItem("selectedDatabase");

    setDb(SvaedDB);

    if (savedUser) {
      setUser(savedUser);
      setActivePortal("admin");
    }

    if (savedEmpUser) {
      setEmpUser(savedEmpUser);
      setRacfId(savedRacfId);
      setActivePortal("user");
    }
  }, []);


  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
    setActivePortal("admin");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setActivePortal(null);
  };

  const handleUserLogin = (empusername) => {
    setEmpUser(empusername);
    setRacfId(empusername);
    localStorage.setItem("empuser", empusername);
    localStorage.setItem("racfId", empusername);
    setActivePortal("user");
  };

  const handleUserLogout = () => {
    setEmpUser(null);
    setRacfId("");
    localStorage.removeItem("empuser");
    localStorage.removeItem("racfId");
    localStorage.removeItem("token");
    localStorage.clear();
    setActivePortal(null);
  };

  const isAuthenticated = user !== null;
  const isEmpauthenticate = empuser !== null;

  return (

        <Router>
          <div>
            <Navbar
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              username={user}
              setUser={setUser}
              setRacfId={setRacfId}
              setEmpUser={setEmpUser}
              isEmpauthenticate={isEmpauthenticate}
              onLoggingout={handleUserLogout}
              user={empuser}
              activePortal={activePortal}
              setActivePortal={setActivePortal}
            />
            <Routes>
              <Route
                path="/admin-Home"
                element={<Home isAuthenticated={isAuthenticated} />}
              />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/master-data"
                element={<ShowData isAuthenticated={isAuthenticated} />}
              />
              <Route
                path="/Details"
                element={<Details isAuthenticated={isAuthenticated} />}
              />
              <Route
                path="/user-login"
                element={<LoginUser onUserLogin={handleUserLogin} />}
              />
        
              <Route
                path="/user-Home"
                element={
                  <HomeUser
                    isEmpauthenticate={isEmpauthenticate}
                    RACF_ID={racfId}
                  />
                }
              />

            </Routes>
          </div>
        </Router>

  );
};

export default App;
