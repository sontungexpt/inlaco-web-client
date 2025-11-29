import { Outlet } from "react-router";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { useEffect } from "react";

const MainLayout = ({ children }) => {
  useEffect(() => {
    console.log("MainLayout mounted");
    return () => {
      console.log("MainLayout unmounted");
    };
  }, []);
  return (
    <div className="app">
      <SideBar />
      <main className="content">
        <TopBar />
        {/* Renders the matched child route */}
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
