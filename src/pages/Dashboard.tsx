import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCheck, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboard(),
  });

  const stats = [
    {
      title: "Total Leads",
      value: data?.leads_count ?? 0,
      icon: Users,
      color: "text-blue-500",
      items: data?.leads || []
    },
    {
      title: "Accounts",
      value: data?.accounts_count ?? 0,
      icon: Building2,
      color: "text-green-500",
      items: data?.accounts || []
    },
    {
      title: "Contacts",
      value: data?.contacts_count ?? 0,
      icon: UserCheck,
      color: "text-purple-500",
      items: data?.contacts || []
    },
    {
      title: "Opportunities",
      value: data?.opportunities_count ?? 0,
      icon: TrendingUp,
      color: "text-orange-500",
      items: data?.opportunities || []
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to BEBOAI CRM</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to BEBOAI CRM</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <p className="text-destructive">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

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
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.leads && data.leads.length > 0 ? (
              <div className="space-y-3">
                {data.leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lead.email}
                      </p>
                    </div>
                    {lead.status && (
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                        {lead.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent leads</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.opportunities && data.opportunities.length > 0 ? (
              <div className="space-y-3">
                {data.opportunities.slice(0, 5).map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{opp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {opp.stage.replace("-", " ")}
                      </p>
                    </div>
                    {opp.amount && (
                      <span className="text-sm font-semibold">
                        ${opp.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent opportunities</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.accounts && data.accounts.length > 0 ? (
              <div className="space-y-3">
                {data.accounts.slice(0, 5).map((account) => (
                  <div key={account.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{account.name}</p>
                      {account.industry && (
                        <p className="text-xs text-muted-foreground">
                          {account.industry}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent accounts</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.contacts && data.contacts.length > 0 ? (
              <div className="space-y-3">
                {data.contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.email && (
                        <p className="text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent contacts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
