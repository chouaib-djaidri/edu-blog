import DashboardNavbar from "@/components/layout/dashboard-navbar";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import PlacementTest from "@/components/tests/placement-test";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { supabaseServer } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { Role, SupabaseJwtPayload } from "@/types/globals";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function DashboardLayout({ children }: Props) {
  const supabase = await supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) redirect("/login");
  const jwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
  const userRole = (jwt.user_role || "user") as Role;

  return (
    <PlacementTest userRole={userRole}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
          } as React.CSSProperties
        }
      >
        <DashboardSidebar userRole={userRole} />
        <SidebarInset>
          <DashboardNavbar role={userRole} />
          <div
            className={cn(
              "px-4 lg:px-2 pb-4 lg:pb-6 pt-2 lg:pt-6 lg:me-2",
              userRole === Role.USER && "lg:pt-2"
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PlacementTest>
  );
}
