
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, CreditCard, TrendingUp, Calendar } from "lucide-react";

// Mock data for charts
const leadData = [
  { name: "Jan", leads: 12 },
  { name: "Feb", leads: 19 },
  { name: "Mar", leads: 14 },
  { name: "Apr", leads: 22 },
  { name: "May", leads: 25 },
  { name: "Jun", leads: 18 },
];

const conversionData = [
  { name: "Converted", value: 63 },
  { name: "In Progress", value: 27 },
  { name: "Lost", value: 10 },
];

const COLORS = ["#7c3aed", "#60a5fa", "#f87171"];

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Section */}
      <section className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your leads today.
        </p>
      </section>

      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,330</div>
            <p className="text-xs text-muted-foreground mt-1">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Itineraries</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground mt-1">
              +7 from last month
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Lead Generation Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Generation</CardTitle>
            <CardDescription>
              Monthly lead acquisition over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid #ccc',
                    borderRadius: '6px' 
                  }} 
                />
                <Bar dataKey="leads" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>
              Current conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and actions on your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 border-b pb-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-blue" />
                <div>
                  <p className="font-medium">New lead created</p>
                  <p className="text-sm text-muted-foreground">Alex Johnson requested a quote for Europe tour</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-4 border-b pb-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-purple" />
                <div>
                  <p className="font-medium">Itinerary updated</p>
                  <p className="text-sm text-muted-foreground">Sarah Miller's Paris itinerary was modified</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday at 4:30 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-4 border-b pb-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-cyan" />
                <div>
                  <p className="font-medium">Proposal accepted</p>
                  <p className="text-sm text-muted-foreground">David Wilson approved the Japan tour proposal</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday at 11:15 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-muted-foreground">Emma Brown made a payment for $1,250</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
