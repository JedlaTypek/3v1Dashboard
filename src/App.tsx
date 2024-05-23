import Header from "./components/Header";
import Button from "./components/Button";
import Alert from "./components/Alert";
import Menu from "./components/Menu";
import Dashboard from "./components/Dasboard";
import DashboardsBar from "./components/DashboardsBar";
import './App.css'
import { useState } from "react";

function App(){
  const [alertVisible, setAlertVisibility] = useState(false);
  const [activeDasboard, setActiveDashboard] = useState(0);
  const [activeMenu, setActiveMenu] = useState(0);


  return(
    <>
      <Header title="3-1v1&nbsp;Dashboard">
        <Menu setActiveDashboard={setActiveDashboard}/>
      </Header>
      <main className="dashboard">
        
        <Dashboard id={activeDasboard}/>
        {alertVisible && <Alert color="danger" onClose={() => setAlertVisibility(false)}>This is an alert!</Alert>}
        <Button color="primary" onClick={() => setAlertVisibility(true)}>
          Click <b>me</b>!
        </Button>
      </main>
      <footer className="footer">{(new Date).getFullYear()} &copy; 3-1v1 Dashboard | Created by Filip Jedlička</footer>
    </>
  )
}

export default App;