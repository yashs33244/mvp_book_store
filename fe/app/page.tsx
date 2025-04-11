"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Testimonials } from "@/components/testimonials";
import { Features } from "@/components/features";
import { Stats } from "@/components/stats";
import { FaqSection } from "@/components/faq-section";

export default function Home() {
  const router = useRouter();
  const { data: user } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6 text-black dark:text-white">
              Connect with readers in your community
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-sans">
              Share your books with others or find your next great read through
              our peer-to-peer book exchange platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black font-body"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Link href="/register?role=owner">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black font-body"
                    >
                      Share Your Books
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register?role=seeker">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto font-body"
                    >
                      Find Books to Borrow
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
              Our platform makes it easy to connect book owners with book
              seekers in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-border shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black dark:text-white text-xl">1</span>
                </div>
                <CardTitle className="text-xl font-serif">
                  Create an Account
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground font-sans">
                  Sign up as a Book Owner to share your collection or as a Book
                  Seeker to find books to borrow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black dark:text-white text-xl">2</span>
                </div>
                <CardTitle className="text-xl font-serif">
                  Connect with Others
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground font-sans">
                  Browse available books or list your own. Our platform makes it
                  easy to find what you're looking for.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-border shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black dark:text-white text-xl">3</span>
                </div>
                <CardTitle className="text-xl font-serif">
                  Exchange Books
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground font-sans">
                  Arrange meetups or deliveries with other users and enjoy your
                  new reads!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">
              Choose Your Role{" "}
              <span className="text-muted-foreground font-sans">
                (You can change your role later)
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
              Whether you want to share your collection or find new books to
              read, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-black dark:text-white" />
                </div>
                <CardTitle className="text-2xl font-serif">
                  Book Owners
                </CardTitle>
                <CardDescription className="font-sans">
                  Share your books with others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>List books you want to share</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Set your own terms for lending</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with readers in your area</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track your shared collection</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/register?role=owner">
                  <Button
                    size="lg"
                    className="bg-black text-white dark:bg-white dark:text-black font-body"
                  >
                    Register as Owner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black dark:text-white" />
                </div>
                <CardTitle className="text-2xl font-serif">
                  Book Seekers
                </CardTitle>
                <CardDescription className="font-sans">
                  Find books to borrow or rent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Browse available books nearby</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Search by title, author, or genre</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Contact book owners directly</span>
                  </li>
                  <li className="flex items-start font-sans">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 mt-0.5 flex-shrink-0" />
                    <span>Save your favorite listings</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/register?role=seeker">
                  <Button
                    size="lg"
                    className="bg-black text-white dark:bg-white dark:text-black font-body"
                  >
                    Register as Seeker
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Features />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <section className="py-20 bg-black text-white dark:bg-white dark:text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Ready to start exchanging books?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90 font-sans">
            Join our community today and connect with fellow book lovers in your
            area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white text-black dark:bg-black dark:text-white border-white dark:border-black font-body"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-black dark:bg-black dark:text-white border-white dark:border-black font-body"
                  >
                    Create a Free Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 dark:border-black dark:text-black dark:hover:bg-black/10 font-body"
                  >
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
