"use client";

import { useState } from "react";
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
import { useLanguage } from "@/contexts/language-context";
import {
  ArrowLeft,
  Search,
  Filter,
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
  Calculator,
  Globe,
  Microscope,
  GraduationCap,
} from "lucide-react";

interface CategoryPageProps {
  categoryId: string;
  onBack: () => void;
  onResourceClick: (resourceId: string) => void;
}

const categoryData = {
  mathematics: {
    title: "Mathematics",
    description:
      "Comprehensive math resources with tactile diagrams, audio explanations, and interactive lessons",
    icon: Calculator,
    color: "blue",
    totalResources: 45,
    subcategories: [
      "Arithmetic",
      "Geometry",
      "Algebra",
      "Statistics",
      "Problem Solving",
    ],
  },
  "language-arts": {
    title: "Language Arts",
    description:
      "Reading, writing, and communication resources in multiple languages with accessibility support",
    icon: BookOpen,
    color: "green",
    totalResources: 67,
    subcategories: [
      "Reading",
      "Writing",
      "Grammar",
      "Literature",
      "Vocabulary",
    ],
  },
  science: {
    title: "Science",
    description:
      "Interactive science lessons with audio descriptions and tactile materials",
    icon: Microscope,
    color: "purple",
    totalResources: 38,
    subcategories: [
      "Biology",
      "Chemistry",
      "Physics",
      "Earth Science",
      "Environmental Science",
    ],
  },
  "social-studies": {
    title: "Social Studies",
    description:
      "History, geography, and cultural studies with accessible maps and timelines",
    icon: Globe,
    color: "orange",
    totalResources: 29,
    subcategories: ["History", "Geography", "Civics", "Culture", "Economics"],
  },
  "sign-language": {
    title: "Sign Language",
    description:
      "Comprehensive sign language learning with video demonstrations and practice exercises",
    icon: Hand,
    color: "teal",
    totalResources: 23,
    subcategories: [
      "Basic Signs",
      "Conversations",
      "Grammar",
      "Advanced",
      "Cultural Context",
    ],
  },
  "teacher-training": {
    title: "Teacher Training",
    description:
      "Professional development resources for inclusive education and accessibility",
    icon: GraduationCap,
    color: "indigo",
    totalResources: 45,
    subcategories: [
      "Inclusive Methods",
      "Accessibility Tools",
      "Assessment",
      "Classroom Management",
      "Professional Development",
    ],
  },
};

const mockResources = [
  {
    id: "1",
    title: "Fractions Made Simple",
    description:
      "Interactive lessons with tactile diagrams and audio explanations for understanding fractions",
    grade: "Grade 4",
    type: "Interactive Lesson",
    formats: ["braille", "audio", "tactile"],
    downloads: 234,
    rating: 4.8,
    duration: "2 hours",
    difficulty: "Beginner",
    subcategory: "Arithmetic",
  },
  {
    id: "2",
    title: "Geometry Shapes and Angles",
    description:
      "Hands-on exploration of geometric shapes with 3D models and audio descriptions",
    grade: "Grade 5",
    type: "Hands-on Activity",
    formats: ["tactile", "audio", "braille"],
    downloads: 189,
    rating: 4.7,
    duration: "1.5 hours",
    difficulty: "Intermediate",
    subcategory: "Geometry",
  },
  {
    id: "3",
    title: "Basic Algebra Introduction",
    description:
      "Step-by-step introduction to algebraic concepts with audio explanations",
    grade: "Grade 6",
    type: "Course",
    formats: ["audio", "braille"],
    downloads: 156,
    rating: 4.6,
    duration: "3 hours",
    difficulty: "Intermediate",
    subcategory: "Algebra",
  },
];

export function CategoryPage({
  categoryId,
  onBack,
  onResourceClick,
}: CategoryPageProps) {
  const { t } = useLanguage();
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const category = categoryData[categoryId as keyof typeof categoryData];
  if (!category) return null;

  const IconComponent = category.icon;

  function getFormatIcon(format: string) {
    switch (format) {
      case "braille":
        return <Braille className="w-3 h-3" />;
      case "audio":
        return <Volume2 className="w-3 h-3" />;
      case "video":
        return <Play className="w-3 h-3" />;
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
      case "tactile":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
          <div
            className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
          >
            <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category.title}
            </h1>
            <p className="text-gray-600 mt-1">{category.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{category.totalResources} resources</span>
              <span>•</span>
              <span>All grade levels</span>
              <span>•</span>
              <span>Multiple formats available</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={`Search ${category.title.toLowerCase()} resources...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={selectedSubcategory}
            onValueChange={setSelectedSubcategory}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {category.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub.toLowerCase()}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Subcategory Quick Links */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Browse by Topic
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubcategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubcategory("all")}
              >
                All Topics
              </Button>
              {category.subcategories.map((sub) => (
                <Button
                  key={sub}
                  variant={
                    selectedSubcategory === sub.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedSubcategory(sub.toLowerCase())}
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Resources */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Featured {category.title} Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onResourceClick(resource.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-6 h-6 text-${category.color}-600`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{resource.grade}</Badge>
                        <Badge variant="secondary">{resource.difficulty}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base leading-tight">
                      {resource.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {resource.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.duration}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.formats.map((format) => (
                        <Badge
                          key={format}
                          variant="outline"
                          className={`text-xs ${getFormatColor(format)}`}
                        >
                          <span className="flex items-center gap-1">
                            {getFormatIcon(format)}
                            {format.charAt(0).toUpperCase() + format.slice(1)}
                          </span>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All {category.title} Resources
              </h2>
              <p className="text-sm text-gray-500">
                Showing {mockResources.length} of {category.totalResources}{" "}
                resources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockResources.concat(mockResources).map((resource, index) => (
                <Card
                  key={`${resource.id}-${index}`}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onResourceClick(resource.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-5 h-5 text-${category.color}-600`}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {resource.grade}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight line-clamp-2">
                      {resource.title}
                    </CardTitle>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {resource.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.formats.slice(0, 2).map((format) => (
                        <Badge
                          key={format}
                          variant="outline"
                          className={`text-xs ${getFormatColor(format)}`}
                        >
                          {getFormatIcon(format)}
                        </Badge>
                      ))}
                      {resource.formats.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.formats.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs bg-transparent"
                    >
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
