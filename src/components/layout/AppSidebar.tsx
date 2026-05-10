import {
  LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, History, Landmark, PiggyBank,
  FileText, Shield, Users, Bell, LogOut, Menu, ChevronRight,
} from "lucide-react";
import finovaLogo from "@/assets/finova-logo.png";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const customerItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Deposit", url: "/deposit", icon: ArrowDownToLine },
  { title: "Withdraw", url: "/withdraw", icon: ArrowUpFromLine },
  { title: "Transactions", url: "/transactions", icon: History },
  { title: "Loans", url: "/loans", icon: Landmark },
  { title: "Fixed Deposits", url: "/fixed-deposits", icon: PiggyBank },
  { title: "Statement", url: "/statement", icon: FileText },
];

const adminItems = [
  { title: "Admin Panel", url: "/admin", icon: Shield },
  { title: "All Users", url: "/admin/users", icon: Users },
  { title: "Loan Requests", url: "/admin/loans", icon: Landmark },
  { title: "Transactions", url: "/admin/transactions", icon: History },
];

export function AppSidebar() {
  const { user, logout, notifications } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? adminItems : customerItems;
  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src={finovaLogo} alt="Finova Bank" className="h-9 w-9 shrink-0 object-contain" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground">Finova Bank</span>
              <span className="text-[11px] text-sidebar-foreground/60">Secure Banking System</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">
            {isAdmin ? "Administration" : "Banking"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-lg px-3 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <div className="mb-2 rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs font-medium text-sidebar-foreground">{user.fullName}</p>
            <p className="text-[10px] text-sidebar-foreground/50">A/C: {user.accountNumber}</p>
          </div>
        )}
        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent h-9">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
