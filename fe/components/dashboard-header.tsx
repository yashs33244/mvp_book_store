"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  LogOut,
  Menu,
  User,
  X,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface DashboardHeaderProps {
  user: UserType;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-black dark:text-white" />
              <span className=" text-lg">Book Exchange</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground font-body"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-body">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-body">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm font-sans">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-body">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="font-body">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-body"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Books
            </Link>
            {user.role === "owner" && (
              <Link
                href="/dashboard?tab=manage"
                className="block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-body"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Listings
              </Link>
            )}
            <button
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-body"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
