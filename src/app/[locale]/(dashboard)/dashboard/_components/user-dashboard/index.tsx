import LastBlog from "./last-blog";
import RecentPointsEarnedTable from "./recent-points-earned-table";
import Stats from "./stats";

const UserDashboard = () => {
  return (
    <div className="space-y-3">
      <Stats />
      <div className="grid grid-cols-2 gap-3">
        <RecentPointsEarnedTable />
        <LastBlog />
      </div>
    </div>
  );
};

export default UserDashboard;
