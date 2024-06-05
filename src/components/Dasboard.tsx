import React, { useState, useEffect } from 'react';
import DashboardsBar from './DashboardsBar';
import type { Dashboard } from './utils';
import createBlankDashboards from './utils';

interface Props {
  id: number;
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
      return `https://api.ecowitt.net/api/v3/device/real_time?application_key=${dashboard.app_key}&api_key=${dashboard.api_key}&mac=${dashboard.mac}&call_back=all&temp_unitid=1&pressure_unitid=3&wind_speed_unitid=6&rainfall_unitid=12`
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
    setData(null);
    if(id === 0){
      const dashboards = getDashboardItems();
      let allData:any[] = [];
      dashboards.forEach((dashboard) => {
        if(dashboard.type != 'dashboard' && dashboard.type != 'wattrouter'){
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
      setData(allData); //Sice se zatím nezobrazí ale jsou tam. Nezobrazí se, protože jsou v poli (asi).
    } else if(getDashboardInfo(id)?.type === 'wattrouter'){
      const dashboard = getDashboardInfo(id);
      if(dashboard != undefined && dashboard.ip != undefined){
        const data = localStorage.getItem(dashboard.ip);
        setData(JSON.parse(data ? data : ''));
      }
    } else{
      getData(id)
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
    }
  }, [id]); // use effect se provede vždy když se změní proměnná ID

  if(data != null && data != undefined){
    switch(getDashboardInfo(id)?.type){
      case 'solax':
        if(!data.success){
          return (
              <p>{data.exception}</p>
          );
        }
        const solaxResult = data?.result;  
        return (
          <>
            <p>Data z: {solaxResult.uploadTime}</p>
            <div className="row solax">
              <div className="col-12 col-md-6 col-lg-3">
                <img className="solaxIcon" src="/icons/home.png" alt="Dům" />
                <p>Aktuální odběr: {solaxResult.acpower}</p>
                <p>Dnešní odběr: {solaxResult.yieldtoday}</p>
                <p>Celkový odběr: {solaxResult.yieldtotal}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <img className="solaxIcon" src="/icons/solar-panel.png" alt="Panely" />
                <p>Celkový výkon: {(solaxResult.powerdc1 == null ? 0 : solaxResult.powerdc1) + (solaxResult.powerdc2 == null ? 0 : solaxResult.powerdc2) + (solaxResult.powerdc3 == null ? 0 : solaxResult.powerdc3) + (solaxResult.powerdc4 == null ? 0 : solaxResult.powerdc4)}</p>
                {solaxResult.powerdc1 != null ? <p>Panel 1: {solaxResult.powerdc1}</p> : ''}
                {solaxResult.powerdc2 != null ? <p>Panel 2: {solaxResult.powerdc2}</p> : ''}
                {solaxResult.powerdc3 != null ? <p>Panel 3: {solaxResult.powerdc3}</p> : ''}
                {solaxResult.powerdc4 != null ? <p>Panel 4: {solaxResult.powerdc4}</p> : ''}
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <img className="solaxIcon" src="/icons/battery.png" alt="Baterie" />
                <p>Stav baterie: {solaxResult.soc}%</p>
                <p>Výkon baterie: {solaxResult.batPower}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <img className="solaxIcon" src="/icons/tower.png" alt="Elektrické vedení" />
                <p>{Math.abs(solaxResult.feedinpower)} {solaxResult.feedinpower < 0 ? 'ze' : 'do'} sítě</p>
              </div>
            </div>
          </>
        );
      case 'ecowitt':
        console.log(data)
        if(data?.code != 0){
          return(
            <p>{data.msg}</p>
          )
        }
        const ecowittResult = data?.data;
        const outdoor = ecowittResult?.outdoor;
        const indoor = ecowittResult?.indoor;
        const rain = ecowittResult?.rainfall_piezo;
        const wind = ecowittResult?.wind;
        const pressure = ecowittResult?.pressure;
        const freezer = ecowittResult?.temp_and_humidity_ch1
        return (
          <>
            <div className="row solax">
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Venku</h3>
                <p>Teplota: {outdoor?.temperature?.value + ' ' + outdoor?.temperature?.unit}</p>
                <p>Pocitová teplota: {outdoor?.feels_like?.value + ' ' + outdoor?.feels_like?.unit}</p>
                <p>Zdánlivá? Teplota: {outdoor?.app_temp?.value + ' ' + outdoor?.app_temp?.unit}</p>
                <p>Rosný bod: {outdoor?.dew_point?.value + ' ' + outdoor?.dew_point?.unit}</p>
                <p>Vlhkost: {outdoor?.humidity?.value + ' ' + outdoor?.humidity?.unit}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Vevnitř</h3>
                <p>Teplota: {indoor?.temperature?.value + ' ' + indoor?.temperature?.unit}</p>
                <p>Vlhkost: {indoor?.humidity?.value + ' ' + indoor?.humidity?.unit}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Déšť</h3>
                <p>Aktuálně: {rain?.rain_rate?.value + ' ' + rain?.rain_rate?.unit}</p>
                <p>Poslední hodina: {rain?.hourly?.value + ' ' + rain?.hourly?.unit}</p>
                <p>Dnes: {rain?.daily?.value + ' ' + rain?.daily?.unit}</p>
                <p>Event: {rain?.event?.value + ' ' + rain?.event?.unit}</p>
                <p>Týden: {rain?.weekly?.value + ' ' + rain?.weekly?.unit}</p>
                <p>Měsíc: {rain?.monthly?.value + ' ' + rain?.monthly?.unit}</p>
                {/*<p>Rok: {rain?.yearly?.value + ' ' + rain?.yearly?.unit}</p> skrytý, protože kvůli špatného předchozího čidla je tam teď 9999 a nejde vynulovat, další rok ho budu zobrazovat*/}
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Vítr</h3>
                <p>Rychlost: {wind?.wind_speed?.value + ' ' + wind?.wind_speed?.unit}</p>
                <p>Nárazy: {wind?.wind_gust?.value + ' ' + wind?.wind_gust?.unit}</p>
                <p>Směr: {wind?.wind_direction?.value + ' ' + wind?.wind_direction?.unit}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Tlak</h3>
                <p>Relativní: {pressure?.relative?.value + ' ' + pressure?.relative?.unit}</p>
                <p>Absolutní: {pressure?.absolute?.value + ' ' + pressure?.absolute?.unit}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <h3>Mrazák</h3>
                <p>Teplota: {freezer?.temperature?.value + ' ' + freezer?.temperature?.unit}</p>
                <p>Vlhkost: {freezer?.humidity?.value + ' ' + freezer?.humidity?.unit}</p>
              </div>
            </div>
          </>
        );
      case 'wattrouter':
        return (
          <pre>
            {data ? <pre>{JSON.stringify(data.meas, null, 2)}</pre> : <p>No data available</p>}
          </pre>
        );
      default:
        return (
          <pre>
            <p>Dashboard</p>
          </pre>
        );
    
    }
  } else{
    return (
      <pre>
        <p>Loading...</p>
      </pre>
    );
  
  }
}

export default Dashboard;
