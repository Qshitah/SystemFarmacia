import React, { useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Home() {
  const [sidebarOut, setSidebarOut] = useState(false);

  const handleSideBar = () =>{
    setSidebarOut(!sidebarOut);
  }

  return (
    <React.Fragment>
      <div className="wrapper">
        <Navbar sidebarOut={sidebarOut} handleSideBar={handleSideBar}  />
        <div className="ec-page-wrapper">
          <Header sidebarOut={sidebarOut} handleSideBar={handleSideBar}/>
          <Outlet/>
        </div>
      </div>
    </React.Fragment>
  );
}