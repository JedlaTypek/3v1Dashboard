import React from 'react'

interface DashboardItemType{
    name: string;
    url: string;
}

function getDashboardItems() {
    let dashboards = localStorage.getItem('dashboards');
    if (dashboards === null) {
      const initialdashboards = [
        { name: 'Dashboard', visible: true },
        { name: 'Solax', visible: true },
        { name: 'Wattrouter', visible: true },
        { name: 'Ecowitt', visible: true }
      ];
      localStorage.setItem('dashboards', JSON.stringify(initialdashboards));
      return initialdashboards;
    }
    return JSON.parse(dashboards);
  }

const Menu = () => {
    const items:MenuItemType[] = getMenuItems();
    return (
        items.map((item: MenuItemType) => 
            item.visible ? <MenuItem text={item.name || "Dashboard"} active={false} onClick={() => console.log(item.name || 'Dashboard')}/> : ''
          )
    )
}

export default DashboardsBar