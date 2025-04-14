
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LineChart,
  LayoutDashboard,
  Settings,
  Bell,
  Smartphone,
  SunMedium,
  CircleDollarSign,
  Menu
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const path = location.pathname;
  const activePath = path.split("/").filter(Boolean)[1] || "";
  
  const items = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
      active: activePath === "" || activePath === "dashboard",
    },
    {
      name: "Devices",
      icon: <Smartphone className="h-5 w-5" />,
      path: "/dashboard/devices",
      active: activePath === "devices",
    },
    {
      name: "Solar",
      icon: <SunMedium className="h-5 w-5" />,
      path: "/dashboard/solar",
      active: activePath === "solar",
    },
    {
      name: "Analytics",
      icon: <LineChart className="h-5 w-5" />,
      path: "/dashboard/analytics",
      active: activePath === "analytics",
    },
    {
      name: "Sell Energy",
      icon: <CircleDollarSign className="h-5 w-5" />,
      path: "/dashboard/sell",
      active: activePath === "sell",
    },
    {
      name: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      path: "/dashboard/notifications",
      active: activePath === "notifications",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
      active: activePath === "settings",
    },
  ];
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };
  
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMobileMenu}
          />
        )}
        
        <aside
          className={cn(
            "fixed top-0 left-0 h-full bg-white border-r w-64 z-50 transition-transform duration-200 transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-16 border-b flex items-center justify-center">
            <h1 className="text-xl font-bold">Syncarfe</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all",
                      item.active && "bg-gray-100 text-gray-900 font-medium"
                    )}
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </>
    );
  }
  
  return (
    <aside
      className={cn(
        "border-r relative bg-white transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "absolute -right-4 top-8 bg-white border rounded-full p-1 cursor-pointer",
          "hover:bg-gray-50 transition-colors z-10"
        )}
        onClick={toggleCollapse}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-400" />
        )}
      </div>
      
      <div
        className={cn(
          "h-16 border-b flex items-center transition-all",
          collapsed ? "justify-center" : "justify-start px-4"
        )}
      >
        {collapsed ? (
          <span className="font-bold text-xl">S</span>
        ) : (
          <h1 className="text-xl font-bold">Syncarfe</h1>
        )}
      </div>
      
      <nav className={cn("p-2", collapsed && "flex flex-col items-center")}>
        <ul className={cn("space-y-1", collapsed && "flex flex-col items-center w-full")}>
          {items.map((item) => (
            <li key={item.name} className={cn(collapsed && "w-full")}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all",
                  item.active && "bg-gray-100 text-gray-900 font-medium",
                  collapsed
                    ? "justify-center w-full h-9 px-2"
                    : "px-3 py-2 text-gray-500"
                )}
                title={collapsed ? item.name : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
