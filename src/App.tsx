import React, { useState } from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import Alert from "./components/Alert";
import Menu from "./components/Menu";
import Dashboard from "./components/Dasboard";
import DashboardsBar from "./components/DashboardsBar";
import { createBlankDashboards, getDashboardType, DashboardType } from "./components/utils";
import './App.css';

function App() {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState(2);

  return (
    <>
      <Header title="3v1&nbsp;Dashboard">
        <Menu activeDashboard={activeDashboard} setActiveDashboard={setActiveDashboard} />
      </Header>
      {activeDashboard ? <div className="dashboardBar"><DashboardsBar type={getDashboardType(activeDashboard)} setActiveDashboard={setActiveDashboard} /></div> : ''}
      <main className="dashboard">
        <Dashboard id={activeDashboard} />
        {alertVisible && <Alert color="danger" onClose={() => setAlertVisibility(false)}>This is an alert!</Alert>}
        <Button color="primary" onClick={() => setAlertVisibility(true)}>
          Click <b>me</b>!
        </Button>
      </main>
      <footer className="footer">{(new Date).getFullYear()} &copy; 3-1v1 Dashboard | Created by Filip Jedlička</footer>
    </>
  );
}

export default App;
