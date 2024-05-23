import { ReactNode } from 'react'

interface Props{
    active?: boolean;
    text: string;
    onClick: () => void;
}

const MenuItem = ({active=false, text, onClick}:Props) => {
  return (
    <div className={'menuItem' + (active ? ' active' : '')} onClick={onClick}>{text}</div>

  )
}

export default MenuItem