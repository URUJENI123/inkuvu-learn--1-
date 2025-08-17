"use client";

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
import { useLanguage } from "@/contexts/language-context";
import {
  Search,
  Filter,
  BookOpen,
  Video,
  Headphones,
  FileText,
  Star,
  Download,
  Eye,
  Clock,
  Play,
  Volume2,
  Hand,
  BlindsIcon as Braille,
} from "lucide-react";

const resourceCategories = [
  { id: "all", name: "All Resources", count: 247 },
  { id: "mathematics", name: "Mathematics", count: 45 },
  { id: "language", name: "Language Arts", count: 67 },
  { id: "science", name: "Science", count: 38 },
  { id: "social", name: "Social Studies", count: 29 },
  { id: "sign-language", name: "Sign Language", count: 23 },
  { id: "teacher-training", name: "Teacher Training", count: 45 },
];

const featuredResources = [
  {
    id: 1,
    title: "Mathematics Grade 4 - Fractions",
    description:
      "Interactive lessons with tactile diagrams and audio explanations",
    grade: "Grade 4",
    subject: "Mathematics",
    type: "Interactive Lesson",
    formats: ["braille", "audio", "tactile"],
    downloads: 234,
    rating: 4.8,
    duration: "2 hours",
    isNew: false,
    icon: BookOpen,
    iconColor: "blue",
  },
  {
    id: 2,
    title: "Basic Sign Language Dictionary",
    description: "Essential Kinyarwanda signs for daily communication",
    grade: "All Levels",
    subject: "Sign Language",
    type: "Video Dictionary",
    formats: ["video", "sign-language"],
    downloads: 156,
    rating: 4.9,
    duration: "45 min",
    isNew: true,
    icon: Hand,
    iconColor: "green",
  },
  {
    id: 3,
    title: "Science Audio Diagrams - Grade 5",
    description: "Complete lessons with detailed audio descriptions",
    grade: "Grade 5",
    subject: "Science",
    type: "Audio Lesson",
    formats: ["audio", "tactile"],
    downloads: 89,
    rating: 4.7,
    duration: "1.5 hours",
    isNew: false,
    icon: Headphones,
    iconColor: "purple",
  },
];

const allResources = [
  {
    id: 4,
    title: "Kinyarwanda Folk Tales Collection",
    description: "Traditional stories in braille and audio formats",
    grade: "Grade 1-3",
    subject: "Language Arts",
    type: "Story Collection",
    formats: ["braille", "audio"],
    downloads: 178,
    rating: 4.6,
    timeAgo: "2 hours ago",
    icon: FileText,
    iconColor: "orange",
  },
  {
    id: 5,
    title: "English Learning for Beginners",
    description: "Structured lessons with pronunciation guides",
    grade: "All Levels",
    subject: "Language Arts",
    type: "Course",
    formats: ["audio", "text"],
    downloads: 203,
    rating: 4.5,
    timeAgo: "1 day ago",
    icon: BookOpen,
    iconColor: "red",
  },
  {
    id: 6,
    title: "Inclusive Teaching Methods",
    description: "Professional development for educators",
    grade: "Teacher",
    subject: "Teacher Training",
    type: "Training Module",
    formats: ["video", "text"],
    downloads: 145,
    rating: 4.8,
    timeAgo: "3 days ago",
    icon: Video,
    iconColor: "indigo",
  },
  {
    id: 7,
    title: "History of Rwanda - Grade 6",
    description: "Complete lessons with maps and timelines",
    grade: "Grade 6",
    subject: "Social Studies",
    type: "Interactive Lesson",
    formats: ["braille", "audio", "tactile"],
    downloads: 92,
    rating: 4.4,
    timeAgo: "5 days ago",
    icon: BookOpen,
    iconColor: "teal",
  },
];

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

export function DigitalLibrary({
  onNavigateToResource,
  onNavigateToCategory,
}: {
  onNavigateToResource?: (resourceId: string) => void;
  onNavigateToCategory?: (categoryId: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("library.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("library.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder={t("library.search")} className="pl-10 w-96" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t("common.filter")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select grade level" />
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

          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="braille">Braille</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="sign-language">Sign Language</SelectItem>
              <SelectItem value="tactile">Tactile Diagrams</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("library.sort_by")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("library.newest")}</SelectItem>
              <SelectItem value="popular">{t("library.popular")}</SelectItem>
              <SelectItem value="rating">{t("library.rating")}</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Sidebar Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {resourceCategories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-white transition-colors ${
                    category.id === "all"
                      ? "bg-white text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() =>
                    category.id !== "all" && onNavigateToCategory?.(category.id)
                  }
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">
                Quick Filters
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Braille className="w-4 h-4 text-blue-600" />
                  Braille Resources
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  Audio Content
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Hand className="w-4 h-4 text-orange-600" />
                  Sign Language
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Highly Rated
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="featured">
                  {t("library.featured")}
                </TabsTrigger>
                <TabsTrigger value="all">
                  {t("library.all_resources")}
                </TabsTrigger>
                <TabsTrigger value="recent">
                  {t("library.new_resources")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("library.featured_this_week")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredResources.map((resource) => {
                      const IconComponent = resource.icon;
                      return (
                        <Card
                          key={resource.id}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <div
                                className={`w-12 h-12 bg-${resource.iconColor}-100 rounded-lg flex items-center justify-center`}
                              >
                                <IconComponent
                                  className={`w-6 h-6 text-${resource.iconColor}-600`}
                                />
                              </div>
                              <div className="flex gap-2">
                                {resource.isNew && (
                                  <Badge variant="secondary">
                                    {t("common.new")}
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  {resource.grade}
                                </Badge>
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
                                  className={`text-xs ${getFormatColor(
                                    format
                                  )}`}
                                >
                                  <span className="flex items-center gap-1">
                                    {getFormatIcon(format)}
                                    {format.charAt(0).toUpperCase() +
                                      format.slice(1).replace("-", " ")}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Download className="w-4 h-4 mr-2" />
                                {t("common.download")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() =>
                                  onNavigateToResource?.(resource.id.toString())
                                }
                              >
                                <Eye className="w-4 h-4" />
                                {t("common.preview")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("library.all_resources")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t("library.showing_resources") + " 247"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allResources.map((resource) => {
                    const IconComponent = resource.icon;
                    return (
                      <Card
                        key={resource.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className={`w-10 h-10 bg-${resource.iconColor}-100 rounded-lg flex items-center justify-center`}
                            >
                              <IconComponent
                                className={`w-5 h-5 text-${resource.iconColor}-600`}
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
                            className="w-full bg-transparent text-xs"
                          >
                            {t("common.preview")}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("library.new_resources")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t("library.latest_resources")}
                  </p>
                </div>
                <div className="space-y-4">
                  {allResources.slice(0, 3).map((resource) => {
                    const IconComponent = resource.icon;
                    return (
                      <Card
                        key={resource.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 bg-${resource.iconColor}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <IconComponent
                                className={`w-6 h-6 text-${resource.iconColor}-600`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 line-clamp-1">
                                  {resource.title}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-xs ml-2"
                                >
                                  {resource.grade}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {resource.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                                    {resource.timeAgo}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                  >
                                    {t("common.preview")}
                                  </Button>
                                  <Button size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    {t("common.download")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
