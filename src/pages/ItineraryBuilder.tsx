
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, 
  Trash2, 
  Calendar, 
  MapPin, 
  Hotel, 
  Plane, 
  Car, 
  Utensils, 
  Camera, 
  Move 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ItineraryDay {
  id: string;
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

interface ItineraryActivity {
  id: string;
  time: string;
  type: "accommodation" | "transportation" | "sightseeing" | "meal" | "other";
  title: string;
  description: string;
  location: string;
}

// Mock data
const initialDays: ItineraryDay[] = [
  {
    id: "day-1",
    day: 1,
    date: "2023-04-10",
    activities: [
      {
        id: "activity-1",
        time: "08:00",
        type: "transportation",
        title: "Flight to Paris",
        description: "American Airlines AA123",
        location: "Charles de Gaulle Airport"
      },
      {
        id: "activity-2",
        time: "11:30",
        type: "transportation",
        title: "Transfer to Hotel",
        description: "Private car service",
        location: "Paris city center"
      },
      {
        id: "activity-3",
        time: "14:00",
        type: "accommodation",
        title: "Check-in at Hotel",
        description: "Deluxe room with Eiffel Tower view",
        location: "Grand Hotel Paris"
      },
      {
        id: "activity-4",
        time: "19:00",
        type: "meal",
        title: "Welcome Dinner",
        description: "Traditional French cuisine",
        location: "Le Petit Bistro"
      }
    ]
  },
  {
    id: "day-2",
    day: 2,
    date: "2023-04-11",
    activities: [
      {
        id: "activity-5",
        time: "09:00",
        type: "meal",
        title: "Breakfast at Hotel",
        description: "Continental breakfast included",
        location: "Grand Hotel Paris"
      },
      {
        id: "activity-6",
        time: "10:30",
        type: "sightseeing",
        title: "Eiffel Tower Visit",
        description: "Skip-the-line tickets included",
        location: "Eiffel Tower"
      },
      {
        id: "activity-7",
        time: "13:00",
        type: "meal",
        title: "Lunch",
        description: "Casual lunch at a local café",
        location: "Café de Paris"
      },
      {
        id: "activity-8",
        time: "15:00",
        type: "sightseeing",
        title: "Louvre Museum",
        description: "Guided tour of the highlights",
        location: "Louvre Museum"
      }
    ]
  }
];

const activityIcons = {
  accommodation: <Hotel className="h-4 w-4" />,
  transportation: <Plane className="h-4 w-4" />,
  sightseeing: <Camera className="h-4 w-4" />,
  meal: <Utensils className="h-4 w-4" />,
  other: <MapPin className="h-4 w-4" />
};

const activityTypeColors = {
  accommodation: "bg-blue-100 text-blue-800",
  transportation: "bg-purple-100 text-purple-800",
  sightseeing: "bg-green-100 text-green-800",
  meal: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800"
};

const ItineraryBuilder = () => {
  const [itineraryName, setItineraryName] = useState("Paris Trip");
  const [destination, setDestination] = useState("Paris, France");
  const [days, setDays] = useState<ItineraryDay[]>(initialDays);
  const { toast } = useToast();

  const handleAddDay = () => {
    const newDay: ItineraryDay = {
      id: `day-${days.length + 1}`,
      day: days.length + 1,
      date: "",
      activities: []
    };
    
    setDays([...days, newDay]);
    
    toast({
      title: "Day added",
      description: `Day ${days.length + 1} has been added to your itinerary.`
    });
  };

  const handleAddActivity = (dayId: string) => {
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        const newActivity: ItineraryActivity = {
          id: `activity-${Math.random().toString(36).substr(2, 9)}`,
          time: "",
          type: "other",
          title: "New Activity",
          description: "",
          location: ""
        };
        
        return {
          ...day,
          activities: [...day.activities, newActivity]
        };
      }
      return day;
    });
    
    setDays(updatedDays);
  };

  const handleRemoveActivity = (dayId: string, activityId: string) => {
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    });
    
    setDays(updatedDays);
  };
  
  const handleRemoveDay = (dayId: string) => {
    setDays(days.filter(day => day.id !== dayId));
    
    toast({
      title: "Day removed",
      description: "The day has been removed from your itinerary."
    });
  };

  const handleSaveItinerary = () => {
    // This would connect to your backend in a real implementation
    toast({
      title: "Itinerary saved",
      description: "Your itinerary has been saved successfully."
    });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Itinerary Builder</h2>
          <p className="text-muted-foreground">
            Create and customize your travel itinerary
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleSaveItinerary}>Save Draft</Button>
          <Button onClick={handleSaveItinerary}>Save & Publish</Button>
        </div>
      </section>

      {/* Itinerary Details */}
      <Card>
        <CardHeader>
          <CardTitle>Itinerary Details</CardTitle>
          <CardDescription>Basic information about this trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itinerary-name">Itinerary Name</Label>
              <Input
                id="itinerary-name"
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
                placeholder="Enter itinerary name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" defaultValue="2023-04-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" defaultValue="2023-04-17" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Select defaultValue="2">
                <SelectTrigger id="travelers">
                  <SelectValue placeholder="Select number of travelers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-4">
        {days.map((day) => (
          <Card key={day.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Day {day.day}</CardTitle>
                  <Input
                    type="date"
                    value={day.date}
                    onChange={(e) => {
                      const updatedDays = days.map(d => 
                        d.id === day.id ? { ...d, date: e.target.value } : d
                      );
                      setDays(updatedDays);
                    }}
                    className="max-w-[150px] h-8"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => handleRemoveDay(day.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Day
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {day.activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex gap-3 p-3 border rounded-md bg-card hover:shadow-sm transition-shadow group"
                >
                  <div className="mt-0.5">
                    <Button variant="ghost" size="icon" className="cursor-move h-6 w-6">
                      <Move className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex-1 grid sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-2">
                      <Label htmlFor={`${activity.id}-time`} className="text-xs">Time</Label>
                      <Input
                        id={`${activity.id}-time`}
                        type="time"
                        value={activity.time}
                        onChange={(e) => {
                          const updatedDays = days.map(d => {
                            if (d.id === day.id) {
                              return {
                                ...d,
                                activities: d.activities.map(a => 
                                  a.id === activity.id ? { ...a, time: e.target.value } : a
                                )
                              };
                            }
                            return d;
                          });
                          setDays(updatedDays);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor={`${activity.id}-type`} className="text-xs">Type</Label>
                      <Select
                        value={activity.type}
                        onValueChange={(value: any) => {
                          const updatedDays = days.map(d => {
                            if (d.id === day.id) {
                              return {
                                ...d,
                                activities: d.activities.map(a => 
                                  a.id === activity.id ? { ...a, type: value } : a
                                )
                              };
                            }
                            return d;
                          });
                          setDays(updatedDays);
                        }}
                      >
                        <SelectTrigger id={`${activity.id}-type`} className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accommodation">Accommodation</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="sightseeing">Sightseeing</SelectItem>
                          <SelectItem value="meal">Meal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-3">
                      <Label htmlFor={`${activity.id}-title`} className="text-xs">Title</Label>
                      <Input
                        id={`${activity.id}-title`}
                        value={activity.title}
                        onChange={(e) => {
                          const updatedDays = days.map(d => {
                            if (d.id === day.id) {
                              return {
                                ...d,
                                activities: d.activities.map(a => 
                                  a.id === activity.id ? { ...a, title: e.target.value } : a
                                )
                              };
                            }
                            return d;
                          });
                          setDays(updatedDays);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Label htmlFor={`${activity.id}-location`} className="text-xs">Location</Label>
                      <Input
                        id={`${activity.id}-location`}
                        value={activity.location}
                        onChange={(e) => {
                          const updatedDays = days.map(d => {
                            if (d.id === day.id) {
                              return {
                                ...d,
                                activities: d.activities.map(a => 
                                  a.id === activity.id ? { ...a, location: e.target.value } : a
                                )
                              };
                            }
                            return d;
                          });
                          setDays(updatedDays);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveActivity(day.id, activity.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full border border-dashed flex items-center justify-center py-6"
                onClick={() => handleAddActivity(day.id)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full py-6"
          onClick={handleAddDay}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
