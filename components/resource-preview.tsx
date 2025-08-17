"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language-context";
import {
  ArrowLeft,
  Download,
  Star,
  Share2,
  Bookmark,
  Play,
  Volume2,
  Hand,
  BlindsIcon as Braille,
  FileText,
  ThumbsUp,
  MessageSquare,
  Maximize,
  Settings,
  CaptionsIcon as ClosedCaptioning,
  SkipBack,
  SkipForward,
  Pause,
} from "lucide-react";

interface ResourcePreviewProps {
  resourceId: string;
  onBack: () => void;
}

export function ResourcePreview({ resourceId, onBack }: ResourcePreviewProps) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTab, setCurrentTab] = useState("content");

  // Mock resource data - in real app, fetch by resourceId
  const resource = {
    id: resourceId,
    title: "Basic Sign Language Dictionary",
    description:
      "Essential Kinyarwanda signs for daily communication with interactive video lessons and practice exercises",
    grade: "All Levels",
    subject: "Sign Language",
    type: "Video Dictionary",
    formats: ["video", "sign-language", "audio"],
    downloads: 156,
    rating: 4.9,
    reviews: 23,
    duration: "45 min",
    lessons: 12,
    difficulty: "Beginner",
    language: "Kinyarwanda",
    author: "Marie Uwimana",
    publishedDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    tags: ["communication", "daily-life", "beginner", "interactive"],
    videoUrl: "/placeholder.mp4",
    thumbnail: "/placeholder.svg?height=400&width=600",
    chapters: [
      {
        id: 1,
        title: "Greetings and Basic Phrases",
        duration: "8:30",
        completed: true,
      },
      { id: 2, title: "Family Members", duration: "6:45", completed: true },
      { id: 3, title: "Numbers 1-20", duration: "5:20", completed: false },
      { id: 4, title: "Colors and Shapes", duration: "7:15", completed: false },
      { id: 5, title: "Food and Drinks", duration: "9:30", completed: false },
    ],
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {resource.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{resource.grade}</Badge>
                <Badge variant="secondary">{resource.subject}</Badge>
                <span className="text-sm text-gray-500">
                  by {resource.author}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {t("common.share")}
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              {t("common.save")}
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              {t("common.download")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-t-lg overflow-hidden">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </Button>
                    </div>

                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <span className="text-sm">
                            2:30 / {resource.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <ClosedCaptioning className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Dialog
                            open={showSettings}
                            onOpenChange={setShowSettings}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:bg-white/20"
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Video Settings</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Playback Speed
                                  </label>
                                  <div className="flex gap-2 mt-2">
                                    {["0.5x", "1x", "1.25x", "1.5x", "2x"].map(
                                      (speed) => (
                                        <Button
                                          key={speed}
                                          size="sm"
                                          variant="outline"
                                        >
                                          {speed}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Captions
                                  </label>
                                  <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline">
                                      English
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Kinyarwanda
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      French
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Tabs */}
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Resource</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        {resource.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">
                            Duration:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {resource.duration}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Lessons:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {resource.lessons}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Difficulty:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {resource.difficulty}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            Language:
                          </span>
                          <span className="text-gray-600 ml-2">
                            {resource.language}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-medium text-gray-900">Tags:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chapters" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Chapters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {resource.chapters.map((chapter, index) => (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  chapter.completed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {chapter.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {chapter.duration}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews & Ratings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((review) => (
                          <div
                            key={review}
                            className="border-b border-gray-200 pb-4 last:border-b-0"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-700">
                                    JD
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Jean Damascene
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                2 days ago
                              </span>
                            </div>
                            <p className="text-gray-700">
                              Excellent resource for learning basic sign
                              language. The video quality is great and the
                              explanations are clear.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <Button size="sm" variant="ghost">
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Helpful (5)
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Practice Worksheet
                              </p>
                              <p className="text-sm text-gray-500">
                                PDF • 2.3 MB
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Braille className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Braille Reference Guide
                              </p>
                              <p className="text-sm text-gray-500">
                                BRF • 1.8 MB
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resource Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{resource.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({resource.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Downloads</span>
                      <span className="font-medium">{resource.downloads}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Published</span>
                      <span className="font-medium">
                        {resource.publishedDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                      <span className="font-medium">
                        {resource.lastUpdated}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Formats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resource.formats.map((format) => (
                      <div
                        key={format}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          {format === "video" && (
                            <Play className="w-4 h-4 text-purple-600" />
                          )}
                          {format === "audio" && (
                            <Volume2 className="w-4 h-4 text-green-600" />
                          )}
                          {format === "sign-language" && (
                            <Hand className="w-4 h-4 text-orange-600" />
                          )}
                          <span className="text-sm font-medium capitalize">
                            {format.replace("-", " ")}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <img
                          src={`/placeholder.svg?height=60&width=80&query=related resource ${item}`}
                          alt="Related resource"
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            Advanced Sign Language Course
                          </p>
                          <p className="text-xs text-gray-500">Grade 4-6</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">4.7</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
