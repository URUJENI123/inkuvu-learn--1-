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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  BookOpen,
  Video,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  MessageSquare,
  Download,
  Star,
  Shield,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { UploadForms } from "./upload-forms";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  status: "published" | "draft";
  enrollments: number;
  rating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: "active" | "inactive";
  courses: number;
}

export function AdminDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadForms, setShowUploadForms] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Sign Language Basics",
      description: "Introduction to Rwandan Sign Language",
      instructor: "Marie Uwimana",
      duration: "4 weeks",
      level: "Beginner",
      category: "Language",
      status: "published",
      enrollments: 245,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Braille Reading Fundamentals",
      description: "Learn to read and write Braille",
      instructor: "Jean Claude Nzeyimana",
      duration: "6 weeks",
      level: "Beginner",
      category: "Accessibility",
      status: "published",
      enrollments: 189,
      rating: 4.9,
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Jean Baptiste Nzeyimana",
      email: "jean@example.com",
      role: "teacher",
      joinDate: "2024-01-15",
      status: "active",
      courses: 3,
    },
    {
      id: "2",
      name: "Marie Uwimana",
      email: "marie@example.com",
      role: "teacher",
      joinDate: "2024-02-20",
      status: "active",
      courses: 5,
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    level: "",
    category: "",
  });

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.description) {
      const course: Course = {
        id: Date.now().toString(),
        ...newCourse,
        status: "draft",
        enrollments: 0,
        rating: 0,
      };
      setCourses([...courses, course]);
      setNewCourse({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        level: "",
        category: "",
      });
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleUploadComplete = () => {
    console.log("Upload completed successfully");
  };

  const stats = [
    { title: "Total Users", value: "1,247", icon: Users, change: "+12%" },
    { title: "Active Courses", value: "89", icon: BookOpen, change: "+5%" },
    { title: "Video Hours", value: "342", icon: Video, change: "+18%" },
    {
      title: "Forum Posts",
      value: "2,156",
      icon: MessageSquare,
      change: "+23%",
    },
  ];

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {t("Dashboard")}
              {/* <Badge variant="destructive" className="ml-3 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge> */}
            </h1>
            {/* <p className="text-gray-600">{t("managePlatform")}</p> */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Dialog open={showUploadForms} onOpenChange={setShowUploadForms}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Quick Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Upload
                </DialogTitle>
                <DialogDescription>
                  Choose what you'd like to upload to the platform
                </DialogDescription>
              </DialogHeader>
              <UploadForms onUploadComplete={handleUploadComplete} />
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <span>
                    {
                      languageOptions.find((lang) => lang.code === language)
                        ?.flag
                    }
                  </span>
                  <span className="text-sm">
                    {
                      languageOptions.find((lang) => lang.code === language)
                        ?.name
                    }
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as "en" | "fr" | "rw")}
                    className="flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600">
                        {stat.change} from last month
                      </p>
                    </div>
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">
                      New course "Mathematics for All" published
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">25 new users registered today</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm">Forum discussion needs moderation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">
                          {course.enrollments} enrollments
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Course Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Create a new course for the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={newCourse.title}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, title: e.target.value })
                        }
                        placeholder="Enter course title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        value={newCourse.instructor}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            instructor: e.target.value,
                          })
                        }
                        placeholder="Instructor name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder="Course description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newCourse.duration}
                        onChange={(e) =>
                          setNewCourse({
                            ...newCourse,
                            duration: e.target.value,
                          })
                        }
                        placeholder="e.g., 4 weeks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level">Level</Label>
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
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
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
                          <SelectItem value="Mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Accessibility">
                            Accessibility
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddCourse} className="w-full">
                    Create Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-600">
                            {course.duration}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{course.enrollments}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.courses}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Content Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-sm text-gray-600">Total video hours</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Manage Videos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-gray-600">Learning resources</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  Manage Resources
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,934</div>
                <p className="text-sm text-gray-600">Total downloads</p>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Platform Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-16 w-16" />
                  <span className="ml-2">
                    Chart visualization would go here
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-16 w-16" />
                  <span className="ml-2">
                    Chart visualization would go here
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
