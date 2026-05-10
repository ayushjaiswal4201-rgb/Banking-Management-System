import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, notifications } = useAuth();
  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                Welcome, {user?.fullName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
