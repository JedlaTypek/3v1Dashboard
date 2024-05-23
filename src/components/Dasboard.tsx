import React, { useState, useEffect } from 'react';
import DashboardsBar from './DashboardsBar';

interface Props {
  id: number;
}

interface Dashboard {
  id: number;
  type: string;
  name: string;
  token?: string;
  sn?: string;
  visible?: boolean;
  api_key?: string;
  app_key?: string;
  mac?: string;
  ip?: string; // i s portem
}

function createBlankDashboards():Dashboard[]{
  return [
    { id:0, type: 'dashboard',  name: 'Dashboard'},
    { id:1, type: 'solax', name: 'Solax', token: '20221116163014727331150', sn:'SWMX5DURCS'},
    { id:2, type: 'ecowitt', name: 'Ecowitt', api_key: '8d96d223-f0aa-40b8-9bb0-eaa77ba8bfa7', app_key: '0EC6E6476E276E3133F62A2C1CC8B157', mac: '48:3F:DA:54:59:03' },
    { id:3, type: 'wattrouter', name: 'Wattrouter', visible: true, ip:'http://192.168.66.249:8080'}
  ];
}

function getDashboardItems():Dashboard[] {
  let dashboards = localStorage.getItem('dashboards');
  if (dashboards === null) {
    const initialDashboards = createBlankDashboards();
    localStorage.setItem('dashboards', JSON.stringify(initialDashboards));
    return initialDashboards;
  }
  return JSON.parse(dashboards);
}

function getDashboardInfo(id: number): Dashboard | undefined {
  const dashboardsJson = localStorage.getItem('dashboards');
  if (dashboardsJson === null) {
    const initialDashboards = createBlankDashboards();
    localStorage.setItem('dashboards', JSON.stringify(initialDashboards));
    return initialDashboards.find(dashboard => dashboard.id === id);
  }

  const dashboards: Dashboard[] = JSON.parse(dashboardsJson);
  const dashboard = dashboards.find(dashboard => dashboard.id === id);
  return dashboard;
}

function generateUrl(id:number):string | null{
  const dashboard = getDashboardInfo(id);
  if(dashboard === undefined){
    return null;
  }
  switch(dashboard.type){
    case 'solax':
      return `http://localhost:3000/api/solax?token=${dashboard.token != null ? dashboard.token : ' '}&sn=${dashboard.sn != null ? dashboard.sn : ' '}`;
    case 'ecowitt':
      return `https://api.ecowitt.net/api/v3/device/real_time?application_key=${dashboard.app_key}&api_key=${dashboard.api_key}&mac=${dashboard.mac}&call_back=all`
    default:
      return null;
  }
}

async function getData(id: number) {
  const url = generateUrl(id);
  if (url === null) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const result = await response.json(); // Přidán await pro získání JSON dat
    return result;
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
}

const Dashboard = ({id}:Props) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if(id === 0){
      const dashboards = getDashboardItems();
      let allData:any[] = [];
      dashboards.forEach((dashboard) => {
        if(dashboard.type != 'dashboard' && dashboard.type != 'wattrouter'){
          console.log(dashboard.id);
          getData(dashboard.id)
            .then(data =>  allData.push(data))
            .catch(error => console.error('Error:', error));
        } else if(dashboard.type === 'wattrouter'){
          if(dashboard.ip != undefined){
            const data = localStorage.getItem(dashboard.ip);
            allData.push(JSON.parse(data ? data : '').meas);
          }
        }
      })
      console.log(allData)
      setData(allData); //Sice se zatím nezobrazí ale jsou tam. Nezobrazí se, protože jsou v poli (asi).
    } else if(getDashboardInfo(id)?.type === 'wattrouter'){
      const dashboard = getDashboardInfo(id);
      if(dashboard != undefined && dashboard.ip != undefined){
        const data = localStorage.getItem(dashboard.ip);
        console.log(data);
        setData(JSON.parse(data ? data : ''));
      }
    } else{
      getData(id)
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
    }
  }, [id]); // use effect se provede vždy když se změní proměnná ID

  return (
    <pre>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>No data available</p>}
    </pre>
  );
}

export default Dashboard;
