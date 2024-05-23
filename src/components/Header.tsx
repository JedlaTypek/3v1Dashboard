import { ReactNode } from "react";

interface Props{
  children: ReactNode;
  title: string;
}

function Header({children, title}:Props){
  return(
    <div className="header">
      <div className="logo">
        <img src="/logo.svg" alt="Logo" />
        <h2>{title}</h2>
      </div>
      <div className="menu">{children}</div>
    </div>
  )
}
  
export default Header;