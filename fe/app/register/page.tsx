"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRegister } from "@/hooks/useAuth";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const register = useRegister();
  const defaultRole = (searchParams.get("role") || "SEEKER").toUpperCase();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
    role: "OWNER" | "SEEKER";
  }>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: defaultRole as "OWNER" | "SEEKER",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: defaultRole as "OWNER" | "SEEKER",
    }));
  }, [defaultRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: "OWNER" | "SEEKER") => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register.mutateAsync(registerData);
      toast({
        title: "Success",
        description: "Registration successful!",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Email already registered or something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <Toaster />
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join our book exchange community
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  placeholder="+1 (555) 123-4567"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>I want to:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="flex flex-col space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OWNER" id="owner" />
                    <Label htmlFor="owner" className="font-normal text-sm">
                      Share my books (Owner)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SEEKER" id="seeker" />
                    <Label htmlFor="seeker" className="font-normal text-sm">
                      Find books to borrow (Seeker)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={register.isPending}
            >
              {register.isPending ? "Creating Account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-0">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
