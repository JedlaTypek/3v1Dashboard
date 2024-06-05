import MenuItem from './MenuItem'
import { DashboardType, createBlankDashboards } from './utils';

interface Props{
    type: string;
    setActiveDashboard: (id:number) => void;
}

function getDashboardsByType(type:string):DashboardType[] {
  let dashboards = localStorage.getItem('dashboards');
  if (dashboards === null) {
    const initialDashboards = createBlankDashboards();
    localStorage.setItem('dashboards', JSON.stringify(initialDashboards));
    dashboards = localStorage.getItem('dashboards');;
  }
  return JSON.parse(dashboards ? dashboards : '[]').filter((item:DashboardType) => item.type.toLowerCase() == type.toLowerCase());
}

const DashboardsBar = ({type, setActiveDashboard}:Props) => {
  console.log(type);
  const items:DashboardType[] = getDashboardsByType(type);
  console.log(items);
  return (
    items.map((item) => 
      <MenuItem key={item.name} text={item.name} active={false} onClick={() => setActiveDashboard(item.id)}/>
    )
  )
}

export default DashboardsBar