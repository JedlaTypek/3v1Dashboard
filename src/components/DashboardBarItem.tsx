import React from 'react'

interface Props {
        name: string;
        active: boolean;
        func: () => void;
}

const DashboardBarItem = ({name, active, func}: Props) => {
    return (
        <div className={'menuItem' + (active ? ' active' : '')} onClick={func}>{name}</div>
    )
}

export default DashboardBarItem