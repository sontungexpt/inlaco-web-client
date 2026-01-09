import { Outlet } from "react-router";
import SideBar from "./components/SideBar";

const MainLayout = ({ children = <Outlet /> }) => {
  return (
    <div className="app">
      <SideBar />
      <main className="content">
        {/* <TopBar /> */}
        {/* Renders the matched child route */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
