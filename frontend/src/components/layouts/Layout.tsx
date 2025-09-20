import { Outlet } from "react-router-dom";
import { NavbarComponent } from "./Navbar";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-[100vh]">
      <NavbarComponent />
      <main className="flex w-full h-full px-3">
        {children || <Outlet />}
      </main>
    </div>
  );
};
