import { Outlet } from "react-router";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import { useEffect } from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="app">
      <SideBar />
      <main className="content">
        {/* <TopBar /> */}
        {/* Renders the matched child route */}
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
