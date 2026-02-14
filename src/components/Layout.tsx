import { NavLink as RouterNavLink, Outlet } from "react-router-dom";
import { Activity, Building2, BarChart3, AlertTriangle } from "lucide-react";

const navItems = [
  { to: "/", label: "Live Cases", icon: Activity },
  { to: "/hospitals", label: "Hospitals", icon: Building2 },
  { to: "/severity", label: "Distribution", icon: BarChart3 },
];

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">EMERGENCY OPS</h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest">MARRAKECH–SAFI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-severity-mild opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-severity-mild" />
            </span>
            <span className="text-xs font-mono text-muted-foreground">SYSTEM ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
