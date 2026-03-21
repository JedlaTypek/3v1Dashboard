interface DashboardType {
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
  
  export function createBlankDashboards(): DashboardType[] {
    return [
      { 
        id: 1,
        type: 'dashboard',
        name: 'Dashboard'
      }
    ];
  }
  
  export function getDashboardType(id: number): string {
    const dashboards = localStorage.getItem('dashboards');
    if (dashboards === null) {
      const initialDashboards = createBlankDashboards();
      localStorage.setItem('dashboards', JSON.stringify(initialDashboards));
      return initialDashboards.find(dashboard => dashboard.id === id)?.type ?? '';
    }
    const dashboard = JSON.parse(dashboards).find((dashboard: DashboardType) => dashboard.id === id);
    return dashboard?.type ?? '';
  }
  
export type { DashboardType };  
export default null;