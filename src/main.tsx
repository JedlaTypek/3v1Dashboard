import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { xml2js } from 'xml-js';

if(localStorage.getItem('dashboards') != null){
  const wattrouters = JSON.parse(localStorage.getItem('dashboards')).filter((item) => item.type == 'wattrouter');
  wattrouters.forEach((item) => {
    const intervalId = setInterval(() => {
      fetch(`${item.ip}/meas.xml`)
      .then(response => response.text())
      .then(xmlString => {
        //console.log(xmlString);
        const result = xml2js(xmlString, { compact: true });
        localStorage.setItem(item.ip, JSON.stringify(result));
      })
      .catch(error => console.error('Chyba při načítání XML:', error));
      }, 30000);
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
