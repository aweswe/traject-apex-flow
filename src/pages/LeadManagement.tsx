
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  MessagesSquare, 
  Phone, 
  Calendar 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Mock lead data
const mockLeads = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "new",
    source: "website",
    tags: ["family", "europe"],
    lastActivity: "2 hours ago",
    dateAdded: "Apr 2, 2023"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    status: "qualified",
    source: "referral",
    tags: ["honeymoon", "beach"],
    lastActivity: "Yesterday",
    dateAdded: "Mar 28, 2023"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "mbrown@example.com",
    phone: "+1 (555) 345-6789",
    status: "proposal",
    source: "social",
    tags: ["solo", "adventure"],
    lastActivity: "3 days ago",
    dateAdded: "Mar 25, 2023"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    status: "won",
    source: "email",
    tags: ["luxury", "retreat"],
    lastActivity: "1 week ago",
    dateAdded: "Mar 20, 2023"
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    phone: "+1 (555) 567-8901",
    status: "lost",
    source: "tradeshow",
    tags: ["business", "conference"],
    lastActivity: "2 weeks ago",
    dateAdded: "Mar 15, 2023"
  }
];

// Status badge color mapping
const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  qualified: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  proposal: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const LeadManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState(mockLeads);

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
          <p className="text-muted-foreground">
            Manage and track your sales leads
          </p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Lead
        </Button>
      </section>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Leads</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 whitespace-nowrap">Contact</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 whitespace-nowrap">Source</th>
                  <th className="px-4 py-3 whitespace-nowrap">Tags</th>
                  <th className="px-4 py-3 whitespace-nowrap">Last Activity</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date Added</th>
                  <th className="px-4 py-3 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs">{lead.email}</span>
                          <span className="text-xs text-muted-foreground">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`${statusColors[lead.status]} capitalize`}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{lead.source}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{lead.lastActivity}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{lead.dateAdded}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Create Task</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No leads found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;
