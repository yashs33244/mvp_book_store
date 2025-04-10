import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Book Owner",
      content:
        "I've been able to share my collection with so many people in my community. It's wonderful to see my books being enjoyed by others instead of just sitting on a shelf.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Book Seeker",
      content:
        "This platform has completely changed how I read. I've discovered so many great books I wouldn't have found otherwise, and saved a ton of money in the process!",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Book Owner & Seeker",
      content:
        "I love both sharing my books and finding new ones to read. The community is friendly and respectful, and the platform is so easy to use.",
      avatar: "ER",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
            Join thousands of satisfied users who are already exchanging books
            on our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-black dark:text-white fill-current"
                    />
                  ))}
                </div>
                <p className="mb-6 text-foreground font-sans">
                  "{testimonial.content}"
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-body">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium font-sans">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground font-sans">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
