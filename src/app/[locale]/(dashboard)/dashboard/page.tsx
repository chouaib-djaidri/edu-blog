import { supabaseServer } from "@/lib/supabase/server";
import { Role, SupabaseJwtPayload } from "@/types/globals";
import { jwtDecode } from "jwt-decode";
import Feedbacks from "./_components/feedbacks";
import NewLearnersTable from "./_components/new-learners-table";
import Stats from "./_components/stats";
import Tasks from "./_components/tasks";
import UserDashboard from "./_components/user-dashboard";

const DashboardPage = async () => {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return <></>;
  const jwt = jwtDecode<SupabaseJwtPayload>(session.access_token);
  const userRole = jwt.user_role || "user";

  if (userRole === Role.USER) return <UserDashboard />;
  if (userRole === Role.ADMIN) return <p>Creator Dashboard</p>;
  return (
    <div className="space-y-3">
      <Stats />
      <Tasks />
      <div className="grid grid-cols-2 gap-3">
        <NewLearnersTable />
        <Feedbacks />
      </div>
    </div>
  );
};

export default DashboardPage;
