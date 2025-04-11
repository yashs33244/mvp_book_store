"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Tag, X, Filter } from "lucide-react";
import { SearchParams } from "@/hooks/useBooks";

interface BookSearchProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

export function BookSearch({ onSearch, initialParams = {} }: BookSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: initialParams.query || "",
    location: initialParams.location || "",
    genre: initialParams.genre || "all",
    isAvailable:
      initialParams.isAvailable !== undefined
        ? initialParams.isAvailable
        : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      genre: value,
    }));
  };

  const handleAvailabilityChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      isAvailable: value === "true",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    const resetParams = {
      query: "",
      location: "",
      genre: "all",
      isAvailable: true,
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  return (
    <Card className="border-2 border-border">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-xl flex items-center">
          <Search className="mr-2 h-5 w-5 text-primary" />
          Find Books
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="query" className="text-sm font-medium">
                Search Books
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="query"
                  name="query"
                  placeholder="Title, author, or keyword"
                  value={searchParams.query}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State"
                  value={searchParams.location}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium">
                Genre
              </Label>
              <Select
                value={searchParams.genre}
                onValueChange={handleGenreChange}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Genres" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                  <SelectItem value="science-fiction">
                    Science Fiction
                  </SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="self-help">Self-Help</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="availability" className="text-sm font-medium">
              Availability
            </Label>
            <Select
              value={searchParams.isAvailable ? "true" : "false"}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Availability" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Available</SelectItem>
                <SelectItem value="false">Unavailable</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center"
            >
              <X className="mr-1 h-4 w-4" />
              Reset
            </Button>
            <Button type="submit" size="sm" className="flex items-center">
              <Search className="mr-1 h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
