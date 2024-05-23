import MenuItem from './MenuItem'

interface MenuItemType{
    name: string;
    visible: boolean;
    activeId: number;
}

interface Props{
  setActiveDashboard: (id:number) => void;
}

function getMenuItems() {
    let menu = localStorage.getItem('menu');
    if (menu === null) {
      const initialMenu = [
        { name: 'Dashboard', visible: true, activeId:0 },
        { name: 'Solax', visible: true, activeId:1 },
        { name: 'Ecowitt', visible: true, activeId:2 },
        { name: 'Wattrouter', visible: true, activeId:3 }
      ];
      localStorage.setItem('menu', JSON.stringify(initialMenu));
      return initialMenu;
    }
    return JSON.parse(menu);
  }

const Menu = ({setActiveDashboard}:Props) => {
    const items:MenuItemType[] = getMenuItems();

    return (
        items.map((item: MenuItemType) => 
            item.visible ? <MenuItem key={item.name} text={item.name} active={false} onClick={() => setActiveDashboard(item.activeId)}/> : ''
          )
    )
}

export default Menu