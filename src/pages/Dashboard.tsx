import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCheck, TrendingUp, CheckSquare, Calendar, Briefcase, Ticket } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Leads", value: "0", icon: Users, color: "text-blue-500" },
    { title: "Accounts", value: "0", icon: Building2, color: "text-green-500" },
    { title: "Contacts", value: "0", icon: UserCheck, color: "text-purple-500" },
    { title: "Opportunities", value: "0", icon: TrendingUp, color: "text-orange-500" },
    { title: "Tasks", value: "0", icon: CheckSquare, color: "text-pink-500" },
    { title: "Events", value: "0", icon: Calendar, color: "text-indigo-500" },
    { title: "Cases", value: "0", icon: Ticket, color: "text-red-500" },
    { title: "Teams", value: "0", icon: Briefcase, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to BEBOAI CRM</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No upcoming tasks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
