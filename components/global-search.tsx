"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/language-context";
import {
  Search,
  BookOpen,
  FileText,
  Star,
  Download,
  Eye,
  Clock,
  Play,
  Volume2,
  Hand,
  BlindsIcon as Braille,
  MessageSquare,
  Users,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "resource" | "course" | "discussion" | "user";
  title: string;
  description: string;
  category?: string;
  author?: {
    name: string;
    avatar?: string;
    role: string;
  };
  metadata: {
    rating?: number;
    downloads?: number;
    replies?: number;
    views?: number;
    duration?: string;
    formats?: string[];
    grade?: string;
    timeAgo?: string;
  };
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    type: "resource",
    title: "Mathematics Grade 4 - Fractions with Audio",
    description:
      "Interactive lessons with tactile diagrams and comprehensive audio explanations for understanding fractions",
    category: "mathematics",
    author: { name: "Jean Baptiste", role: "Teacher" },
    metadata: {
      rating: 4.8,
      downloads: 234,
      duration: "2 hours",
      formats: ["braille", "audio", "tactile"],
      grade: "Grade 4",
    },
  },
  {
    id: "2",
    type: "course",
    title: "Complete Sign Language Basics Course",
    description:
      "Comprehensive course covering essential Kinyarwanda sign language for daily communication",
    category: "sign-language",
    author: { name: "Marie Uwimana", role: "Instructor" },
    metadata: {
      rating: 4.9,
      downloads: 156,
      duration: "8 hours",
      formats: ["video", "sign-language"],
      grade: "All Levels",
    },
  },
  {
    id: "3",
    type: "discussion",
    title: "Best practices for inclusive classroom setup?",
    description:
      "Discussion about setting up classrooms for accessibility and inclusive learning environments",
    category: "teaching",
    author: { name: "Alice Mukamana", role: "Teacher" },
    metadata: {
      replies: 12,
      views: 145,
      timeAgo: "2 hours ago",
    },
  },
  {
    id: "4",
    type: "user",
    title: "Dr. Emmanuel Nzeyimana",
    description:
      "Special Education Expert specializing in inclusive teaching methods and accessibility",
    author: {
      name: "Dr. Emmanuel Nzeyimana",
      role: "Expert",
      avatar: "/placeholder.svg",
    },
    metadata: {},
  },
];

export function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        // Filter mock results based on search query and filters
        let filteredResults = mockSearchResults.filter(
          (result) =>
            result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (selectedType !== "all") {
          filteredResults = filteredResults.filter(
            (result) => result.type === selectedType
          );
        }

        if (selectedCategory !== "all") {
          filteredResults = filteredResults.filter(
            (result) => result.category === selectedCategory
          );
        }

        setResults(filteredResults);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedType, selectedCategory]);

  function getTypeIcon(type: string) {
    switch (type) {
      case "resource":
        return <FileText className="w-4 h-4" />;
      case "course":
        return <BookOpen className="w-4 h-4" />;
      case "discussion":
        return <MessageSquare className="w-4 h-4" />;
      case "user":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  }

  function getFormatIcon(format: string) {
    switch (format) {
      case "braille":
        return <Braille className="w-3 h-3" />;
      case "audio":
        return <Volume2 className="w-3 h-3" />;
      case "video":
        return <Play className="w-3 h-3" />;
      case "sign-language":
        return <Hand className="w-3 h-3" />;
      case "tactile":
        return <FileText className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  }

  function getFormatColor(format: string) {
    switch (format) {
      case "braille":
        return "bg-blue-100 text-blue-700";
      case "audio":
        return "bg-green-100 text-green-700";
      case "video":
        return "bg-purple-100 text-purple-700";
      case "sign-language":
        return "bg-orange-100 text-orange-700";
      case "tactile":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl mt-8 mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Search Inkuvu Learn</CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for resources, courses, discussions, or people..."
              className="pl-12 text-lg h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="resource">Resources</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="discussion">Discussions</SelectItem>
                <SelectItem value="user">People</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="language">Language Arts</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="social-studies">Social Studies</SelectItem>
                <SelectItem value="sign-language">Sign Language</SelectItem>
                <SelectItem value="teacher-training">
                  Teacher Training
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="All Formats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="braille">Braille</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="sign-language">Sign Language</SelectItem>
                  <SelectItem value="tactile">Tactile</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="grade-1">Grade 1</SelectItem>
                  <SelectItem value="grade-2">Grade 2</SelectItem>
                  <SelectItem value="grade-3">Grade 3</SelectItem>
                  <SelectItem value="grade-4">Grade 4</SelectItem>
                  <SelectItem value="grade-5">Grade 5</SelectItem>
                  <SelectItem value="grade-6">Grade 6</SelectItem>
                  <SelectItem value="teacher">Teacher Resources</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Search Results */}
          {searchQuery.length > 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {isLoading
                    ? "Searching..."
                    : `Found ${results.length} results for "${searchQuery}"`}
                </p>
                {results.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Showing results sorted by {sortBy}
                  </p>
                )}
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All ({results.length})</TabsTrigger>
                  <TabsTrigger value="resource">
                    Resources (
                    {results.filter((r) => r.type === "resource").length})
                  </TabsTrigger>
                  <TabsTrigger value="course">
                    Courses ({results.filter((r) => r.type === "course").length}
                    )
                  </TabsTrigger>
                  <TabsTrigger value="discussion">
                    Discussions (
                    {results.filter((r) => r.type === "discussion").length})
                  </TabsTrigger>
                  <TabsTrigger value="user">
                    People ({results.filter((r) => r.type === "user").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {results.map((result) => (
                      <Card
                        key={result.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium text-gray-900 line-clamp-1">
                                    {result.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                    {result.description}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="ml-2 capitalize"
                                >
                                  {result.type}
                                </Badge>
                              </div>

                              {result.author && (
                                <div className="flex items-center gap-2 mb-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage
                                      src={
                                        result.author.avatar ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="text-xs">
                                      {result.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-600">
                                    {result.author.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {result.author.role}
                                  </Badge>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  {result.metadata.rating && (
                                    <span className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      {result.metadata.rating}
                                    </span>
                                  )}
                                  {result.metadata.downloads && (
                                    <span className="flex items-center gap-1">
                                      <Download className="w-4 h-4" />
                                      {result.metadata.downloads}
                                    </span>
                                  )}
                                  {result.metadata.replies && (
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      {result.metadata.replies}
                                    </span>
                                  )}
                                  {result.metadata.views && (
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {result.metadata.views}
                                    </span>
                                  )}
                                  {result.metadata.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {result.metadata.duration}
                                    </span>
                                  )}
                                  {result.metadata.timeAgo && (
                                    <span>{result.metadata.timeAgo}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {result.metadata.formats && (
                                    <div className="flex gap-1">
                                      {result.metadata.formats
                                        .slice(0, 3)
                                        .map((format) => (
                                          <Badge
                                            key={format}
                                            variant="outline"
                                            className={`text-xs ${getFormatColor(
                                              format
                                            )}`}
                                          >
                                            {getFormatIcon(format)}
                                          </Badge>
                                        ))}
                                      {result.metadata.formats.length > 3 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{result.metadata.formats.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  {result.metadata.grade && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {result.metadata.grade}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Individual type tabs with filtered results */}
                {["resource", "course", "discussion", "user"].map((type) => (
                  <TabsContent key={type} value={type} className="mt-6">
                    <div className="space-y-4">
                      {results
                        .filter((result) => result.type === type)
                        .map((result) => (
                          <Card
                            key={result.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <CardContent className="p-4">
                              {/* Same content structure as above */}
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {getTypeIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-medium text-gray-900 line-clamp-1">
                                        {result.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                        {result.description}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Same metadata display as above */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Empty State */}
          {searchQuery.length <= 2 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search Inkuvu Learn
              </h3>
              <p className="text-gray-600 mb-6">
                Find resources, courses, discussions, and people across the
                platform
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Mathematics</Badge>
                <Badge variant="outline">Sign Language</Badge>
                <Badge variant="outline">Teacher Training</Badge>
                <Badge variant="outline">Braille Resources</Badge>
                <Badge variant="outline">Audio Content</Badge>
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery.length > 2 && results.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're
                looking for
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedCategory("all");
                    setSelectedFormat("all");
                    setSelectedGrade("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
