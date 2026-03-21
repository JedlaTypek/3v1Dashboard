import MenuItem from './MenuItem'

interface MenuItemType{
    name: string;
    activeDashboardId: number;
}

interface Props{
  activeDashboard: number;
  setActiveDashboard: (id:number) => void;
}

function getMenuItems() {
    let menu = localStorage.getItem('menu');
    if (menu === null) {
      const initialMenu = [
        { name: 'Dashboard', activeDashboardId:1 }
      ];
      localStorage.setItem('menu', JSON.stringify(initialMenu));
      return initialMenu;
    }
    return JSON.parse(menu);
  }

const Menu = ({activeDashboard, setActiveDashboard}:Props) => {
    const items:MenuItemType[] = getMenuItems();

    return (
      <>
        {items.map((item: MenuItemType) => 
            <MenuItem key={item.name} text={item.name} active={item.activeDashboardId == activeDashboard} onClick={() => setActiveDashboard(item.activeDashboardId)}/>
          )}
        <MenuItem key='create' text='+' className='createBtn' onClick={() => setActiveDashboard(0)}/>
      </>
    )
}

export default Menu