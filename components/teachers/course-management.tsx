"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Users,
  Eye,
  Upload,
  Clock,
  Star,
  Volume2,
  Hand,
  BlindsIcon as Braille,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  status: "draft" | "published" | "archived";
  students: number;
  rating: number;
  accessibility: {
    braille: boolean;
    audio: boolean;
    signLanguage: boolean;
    tactile: boolean;
    captions: boolean;
  };
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "interactive" | "assessment";
  duration: number;
  order: number;
  content: string;
  resources: Resource[];
}

interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "audio" | "image";
  url: string;
  accessibility: string[];
}

export function CourseManagement() {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Sign Language Basics",
      description: "Introduction to Rwandan Sign Language for beginners",
      category: "Language",
      level: "Beginner",
      duration: "4 weeks",
      language: "rw",
      status: "published",
      students: 45,
      rating: 4.8,
      accessibility: {
        braille: false,
        audio: true,
        signLanguage: true,
        tactile: false,
        captions: true,
      },
      lessons: [
        {
          id: "1",
          title: "Basic Greetings",
          description: "Learn essential greeting signs",
          type: "video",
          duration: 15,
          order: 1,
          content:
            "Introduction to basic greeting signs in Rwandan Sign Language",
          resources: [],
        },
        {
          id: "2",
          title: "Family Signs",
          description: "Signs for family members",
          type: "video",
          duration: 20,
          order: 2,
          content: "Learn signs for different family members",
          resources: [],
        },
      ],
    },
    {
      id: "2",
      title: "Inclusive Teaching Methods",
      description: "Professional development for inclusive education",
      category: "Teacher Training",
      level: "Intermediate",
      duration: "6 weeks",
      language: "en",
      status: "draft",
      students: 0,
      rating: 0,
      accessibility: {
        braille: true,
        audio: true,
        signLanguage: false,
        tactile: true,
        captions: true,
      },
      lessons: [],
    },
  ]);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    category: "",
    level: "",
    duration: "",
    language: "en",
    status: "draft",
    accessibility: {
      braille: false,
      audio: false,
      signLanguage: false,
      tactile: false,
      captions: false,
    },
    lessons: [],
  });

  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description) {
      const course: Course = {
        id: Date.now().toString(),
        students: 0,
        rating: 0,
        lessons: [],
        ...newCourse,
      } as Course;
      setCourses([...courses, course]);
      setNewCourse({
        title: "",
        description: "",
        category: "",
        level: "",
        duration: "",
        language: "en",
        status: "draft",
        accessibility: {
          braille: false,
          audio: false,
          signLanguage: false,
          tactile: false,
          captions: false,
        },
        lessons: [],
      });
      setIsCreating(false);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
    if (selectedCourse?.id === id) {
      setSelectedCourse(null);
    }
  };

  const getAccessibilityIcons = (accessibility: Course["accessibility"]) => {
    const icons = [];
    if (accessibility.braille)
      icons.push(<Braille key="braille" className="w-4 h-4 text-blue-600" />);
    if (accessibility.audio)
      icons.push(<Volume2 key="audio" className="w-4 h-4 text-green-600" />);
    if (accessibility.signLanguage)
      icons.push(<Hand key="sign" className="w-4 h-4 text-orange-600" />);
    if (accessibility.tactile)
      icons.push(
        <FileText key="tactile" className="w-4 h-4 text-purple-600" />
      );
    return icons;
  };

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCourse.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    selectedCourse.status === "published"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedCourse.status}
                </Badge>
                <span className="text-sm text-gray-600">
                  {selectedCourse.students} students enrolled
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="bg-white">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Course Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={selectedCourse.title}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedCourse.description}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={selectedCourse.category}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Language">Language</SelectItem>
                            <SelectItem value="Mathematics">
                              Mathematics
                            </SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Teacher Training">
                              Teacher Training
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Select value={selectedCourse.level}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Braille className="h-4 w-4 text-blue-600" />
                          <Label htmlFor="braille">Braille Support</Label>
                        </div>
                        <Switch
                          id="braille"
                          checked={selectedCourse.accessibility.braille}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-green-600" />
                          <Label htmlFor="audio">Audio Descriptions</Label>
                        </div>
                        <Switch
                          id="audio"
                          checked={selectedCourse.accessibility.audio}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Hand className="h-4 w-4 text-orange-600" />
                          <Label htmlFor="sign">Sign Language</Label>
                        </div>
                        <Switch
                          id="sign"
                          checked={selectedCourse.accessibility.signLanguage}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <Label htmlFor="tactile">Tactile Materials</Label>
                        </div>
                        <Switch
                          id="tactile"
                          checked={selectedCourse.accessibility.tactile}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Students Enrolled
                      </span>
                      <span className="font-medium">
                        {selectedCourse.students}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Average Rating
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {selectedCourse.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Lessons
                      </span>
                      <span className="font-medium">
                        {selectedCourse.lessons.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-medium">
                        {selectedCourse.duration}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resource
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Students
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Curriculum</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <AccordionItem key={lesson.id} value={lesson.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                              {index + 1}
                            </div>
                            <div className="text-left">
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{lesson.type}</Badge>
                            <span className="text-sm text-gray-600 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}min
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-11 space-y-4">
                          <p className="text-gray-700">{lesson.content}</p>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                            >
                              <Video className="h-3 w-3 mr-1" />
                              Add Video
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Add Resource
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {selectedCourse.lessons.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No lessons yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start building your course by adding your first lesson.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Lesson
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Enrolled Students</h2>
              <Button variant="outline" className="bg-white">
                Export Student List
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedCourse.students > 0
                      ? `${selectedCourse.students} Students Enrolled`
                      : "No students yet"}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCourse.students > 0
                      ? "Student management features will be available here."
                      : "Students will appear here once they enroll in your course."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Resources</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No resources uploaded
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add supplementary materials, documents, and resources for
                    your course.
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold">Course Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Course Status</Label>
                    <Select value={selectedCourse.status}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enrollment">Allow Enrollment</Label>
                    <Switch id="enrollment" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="certificate">Issue Certificates</Label>
                    <Switch id="certificate" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">
                      Delete Course
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      This action cannot be undone. This will permanently delete
                      the course and all associated data.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCourse(selectedCourse.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-600">Create and manage your courses</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <Badge
                  variant={
                    course.status === "published" ? "default" : "secondary"
                  }
                >
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{course.lessons.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {course.rating || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getAccessibilityIcons(course.accessibility)}
                  {getAccessibilityIcons(course.accessibility).length === 0 && (
                    <span className="text-xs text-gray-500">
                      No accessibility features
                    </span>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Course Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Set up your new course with basic information and accessibility
              features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-title">Course Title</Label>
                <Input
                  id="new-title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <Label htmlFor="new-category">Category</Label>
                <Select
                  value={newCourse.category}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Teacher Training">
                      Teacher Training
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="Describe your course"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-level">Level</Label>
                <Select
                  value={newCourse.level}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-duration">Duration</Label>
                <Input
                  id="new-duration"
                  value={newCourse.duration}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  placeholder="e.g., 4 weeks"
                />
              </div>
              <div>
                <Label htmlFor="new-language">Language</Label>
                <Select
                  value={newCourse.language}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="rw">Kinyarwanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-base font-medium">
                Accessibility Features
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-braille"
                    checked={newCourse.accessibility?.braille}
                    onCheckedChange={(checked) =>
                      setNewCourse({
                        ...newCourse,
                        accessibility: {
                          ...newCourse.accessibility!,
                          braille: checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="new-braille"
                    className="flex items-center space-x-2"
                  >
                    <Braille className="h-4 w-4 text-blue-600" />
                    <span>Braille Support</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-audio"
                    checked={newCourse.accessibility?.audio}
                    onCheckedChange={(checked) =>
                      setNewCourse({
                        ...newCourse,
                        accessibility: {
                          ...newCourse.accessibility!,
                          audio: checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="new-audio"
                    className="flex items-center space-x-2"
                  >
                    <Volume2 className="h-4 w-4 text-green-600" />
                    <span>Audio Descriptions</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-sign"
                    checked={newCourse.accessibility?.signLanguage}
                    onCheckedChange={(checked) =>
                      setNewCourse({
                        ...newCourse,
                        accessibility: {
                          ...newCourse.accessibility!,
                          signLanguage: checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="new-sign"
                    className="flex items-center space-x-2"
                  >
                    <Hand className="h-4 w-4 text-orange-600" />
                    <span>Sign Language</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-tactile"
                    checked={newCourse.accessibility?.tactile}
                    onCheckedChange={(checked) =>
                      setNewCourse({
                        ...newCourse,
                        accessibility: {
                          ...newCourse.accessibility!,
                          tactile: checked,
                        },
                      })
                    }
                  />
                  <Label
                    htmlFor="new-tactile"
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span>Tactile Materials</span>
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="bg-white"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCourse}>Create Course</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
