import { ReactNode } from 'react'

interface Props{
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
  onClose: () => void;
}

const Alert = ({children, color='primary', onClose}:Props) => {
  return (
    <div className={"alert alert-dismissible fade show alert-"+ color} role="alert">
        {children}
        <button type="button" className="btn-close" onClick={onClose} data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default Alert