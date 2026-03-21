import { ReactNode } from 'react'

interface Props{
    active?: boolean;
    text: string;
    onClick: () => void;
    className?: string;
}

const MenuItem = ({active, text, onClick, className}:Props) => {
  return (
    <div className={'menuItem' + (active ? ' active' : '') + (className ? ` ${className}` : '')} onClick={onClick}>{text}</div>

  )
}

export default MenuItem