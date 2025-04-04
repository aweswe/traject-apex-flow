
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Eye, 
  Download, 
  Send, 
  FileText, 
  PenLine 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProposalBuilder = () => {
  const [client, setClient] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const { toast } = useToast();

  const handleSendProposal = () => {
    toast({
      title: "Proposal Sent",
      description: "The proposal has been sent to the client.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your proposal draft has been saved successfully.",
    });
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(price) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    const discountAmount = basePrice * (discount / 100);
    return (basePrice - discountAmount).toFixed(2);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proposal Builder</h2>
          <p className="text-muted-foreground">
            Create and send professional travel proposals
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSendProposal}>
            <Send className="mr-2 h-4 w-4" />
            Send Proposal
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Proposal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Itinerary Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Itinerary</CardTitle>
              <CardDescription>Select the client and itinerary for this proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="michael-brown">Michael Brown</SelectItem>
                    <SelectItem value="emily-davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itinerary">Itinerary</Label>
                <Select value={itinerary} onValueChange={setItinerary}>
                  <SelectTrigger id="itinerary">
                    <SelectValue placeholder="Select an itinerary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paris-adventure">Paris Adventure</SelectItem>
                    <SelectItem value="italian-getaway">Italian Getaway</SelectItem>
                    <SelectItem value="tokyo-explorer">Tokyo Explorer</SelectItem>
                    <SelectItem value="bali-retreat">Bali Retreat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Details</CardTitle>
              <CardDescription>Set the price and any discounts for this proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Add any special notes or terms for this proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter any special notes, terms, or additional information for the client..."
                className="min-h-[150px]"
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-terms" defaultChecked />
                  <Label htmlFor="include-terms">Include standard terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-cancellation" defaultChecked />
                  <Label htmlFor="include-cancellation">Include cancellation policy</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Template Selection */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>Choose a template for your proposal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-2 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-[3/4] rounded-sm bg-muted mb-2"></div>
                  <p className="text-sm font-medium text-center">Professional</p>
                </div>
                <div className="border rounded-md p-2 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-[3/4] rounded-sm bg-muted mb-2"></div>
                  <p className="text-sm font-medium text-center">Modern</p>
                </div>
                <div className="border rounded-md p-2 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-[3/4] rounded-sm bg-muted mb-2"></div>
                  <p className="text-sm font-medium text-center">Luxury</p>
                </div>
                <div className="border rounded-md p-2 cursor-pointer hover:border-primary transition-colors">
                  <div className="aspect-[3/4] rounded-sm bg-muted mb-2"></div>
                  <p className="text-sm font-medium text-center">Adventure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Preview and download your proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview Proposal
              </Button>
              <Button className="w-full" variant="outline">
                <PenLine className="mr-2 h-4 w-4" />
                Customize Design
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          {/* Recent Proposals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">Sarah Johnson - Paris Trip</span>
                  <span className="text-muted-foreground">2d ago</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">Michael Brown - Bali Retreat</span>
                  <span className="text-muted-foreground">3d ago</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">Emily Davis - Japan Tour</span>
                  <span className="text-muted-foreground">1w ago</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full p-0">View All Proposals</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalBuilder;
