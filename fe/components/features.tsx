import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  BookOpen,
  MapPin,
  Users,
  Bell,
  Filter,
  Star,
  Clock,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find books by title, author, genre, or location to discover exactly what you're looking for.",
    },
    {
      icon: BookOpen,
      title: "Detailed Listings",
      description:
        "View comprehensive information about each book, including condition and availability.",
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description:
        "Connect with book owners and seekers in your local area for convenient exchanges.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a growing community of book lovers who share your passion for reading.",
    },
    {
      icon: Bell,
      title: "Notifications",
      description:
        "Receive alerts when books you're interested in become available.",
    },
    {
      icon: Filter,
      title: "Smart Filtering",
      description:
        "Filter results by multiple criteria to find exactly what you're looking for.",
    },
    {
      icon: Star,
      title: "User Ratings",
      description:
        "See ratings and reviews from other users to ensure quality exchanges.",
    },
    {
      icon: Clock,
      title: "Availability Tracking",
      description:
        "Easily mark books as available or unavailable as your collection changes.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 font-serif">
            Platform Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Our book exchange platform is packed with features to make sharing
            and finding books simple and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-black dark:text-white" />
                </div>
                <CardTitle className="text-lg font-serif">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-sans">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
