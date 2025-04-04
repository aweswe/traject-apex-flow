
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Switch 
} from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <section>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </section>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales">Sales Agent</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="Travel specialist with over 5 years of experience in luxury travel planning."
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={handleSaveSettings}>Save Profile</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleSaveSettings}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the application
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout
                    </p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Select defaultValue="purple">
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveSettings}>Save Appearance Settings</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>PDF Template Settings</CardTitle>
              <CardDescription>
                Configure the appearance of generated PDFs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-template">Default PDF Template</Label>
                <Select defaultValue="professional">
                  <SelectTrigger id="pdf-template">
                    <SelectValue placeholder="Select PDF template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Logo</span>
                  </div>
                  <Button variant="outline" size="sm">Change Logo</Button>
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Save PDF Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mobile-notifications">Mobile Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your mobile device
                    </p>
                  </div>
                  <Switch id="mobile-notifications" defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lead-notifications">New Leads</Label>
                      <p className="text-sm text-muted-foreground">
                        When a new lead is created
                      </p>
                    </div>
                    <Switch id="lead-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="proposal-notifications">Proposal Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        When a proposal is viewed or accepted
                      </p>
                    </div>
                    <Switch id="proposal-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-notifications">Payments</Label>
                      <p className="text-sm text-muted-foreground">
                        When a payment is received or due
                      </p>
                    </div>
                    <Switch id="payment-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-notifications">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Important system updates and announcements
                      </p>
                    </div>
                    <Switch id="system-notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Connect third-party services to enhance functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="google-maps">Google Maps API</Label>
                    <p className="text-sm text-muted-foreground">
                      For maps and location services
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-500">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="openai">OpenAI API</Label>
                    <p className="text-sm text-muted-foreground">
                      For AI-powered features
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stripe">Stripe</Label>
                    <p className="text-sm text-muted-foreground">
                      For payment processing
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="whatsapp">WhatsApp Business API</Label>
                    <p className="text-sm text-muted-foreground">
                      For client messaging
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Google Maps API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type="password" 
                      value="••••••••••••••••••••••••" 
                      readOnly 
                    />
                    <Button variant="outline">Show</Button>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Save Integration Settings</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Import/Export</CardTitle>
              <CardDescription>
                Import or export your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Import Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Import leads, clients, or itineraries from a CSV file
                  </p>
                  <Button variant="outline">Import</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Export Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your data to a CSV or Excel file
                  </p>
                  <Button variant="outline">Export</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
