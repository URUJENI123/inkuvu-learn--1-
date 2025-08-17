"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseManagement } from "./course-management";
import { StudentProgress } from "./student-progress";
import { TeachingAnalytics } from "./teaching-analytics";
import {
  Users,
  BookOpen,
  Video,
  BarChart3,
  Plus,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
  Globe,
  ChevronDown,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

interface TeacherCourse {
  id: string;
  title: string;
  students: number;
  completionRate: number;
  avgRating: number;
  lastActivity: string;
  status: "active" | "draft" | "completed";
}

interface StudentProgressData {
  id: string;
  name: string;
  avatar?: string;
  course: string;
  progress: number;
  lastActive: string;
  needsAttention: boolean;
}

export function TeachersDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const teacherCourses: TeacherCourse[] = [
    {
      id: "1",
      title: "Sign Language Basics",
      students: 45,
      completionRate: 78,
      avgRating: 4.8,
      lastActivity: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      title: "Inclusive Teaching Methods",
      students: 32,
      completionRate: 65,
      avgRating: 4.9,
      lastActivity: "1 day ago",
      status: "active",
    },
    {
      id: "3",
      title: "Braille Reading Fundamentals",
      students: 28,
      completionRate: 92,
      avgRating: 4.7,
      lastActivity: "3 days ago",
      status: "completed",
    },
  ];

  const recentStudents: StudentProgressData[] = [
    {
      id: "1",
      name: "Marie Uwimana",
      course: "Sign Language Basics",
      progress: 85,
      lastActive: "1 hour ago",
      needsAttention: false,
    },
    {
      id: "2",
      name: "Jean Baptiste",
      course: "Inclusive Teaching Methods",
      progress: 45,
      lastActive: "2 days ago",
      needsAttention: true,
    },
    {
      id: "3",
      name: "Alice Mukamana",
      course: "Sign Language Basics",
      progress: 92,
      lastActive: "30 min ago",
      needsAttention: false,
    },
  ];

  const stats = [
    {
      title: "My Students",
      value: "105",
      icon: Users,
      change: "+8 this week",
      color: "blue",
    },
    {
      title: "Active Courses",
      value: "3",
      icon: BookOpen,
      change: "2 in progress",
      color: "green",
    },
    {
      title: "Avg Completion",
      value: "78%",
      icon: TrendingUp,
      change: "+5% this month",
      color: "purple",
    },
    {
      title: "Student Rating",
      value: "4.8",
      icon: Star,
      change: "Excellent feedback",
      color: "yellow",
    },
  ];

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <GraduationCap className="h-8 w-8 mr-3 text-blue-600" />
              Teachers Dashboard
              <Badge
                variant="secondary"
                className="ml-3 bg-blue-100 text-blue-700"
              >
                Educator
              </Badge>
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your courses and track student
              progress.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>

          <Button variant="outline" className="bg-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>

          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-white"
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm text-${stat.color}-600`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Course Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recent Course Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.lastActivity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            course.status === "active" ? "default" : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {course.completionRate}% complete
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-white">
                  View All Courses
                </Button>
              </CardContent>
            </Card>

            {/* Students Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Students Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents
                    .filter((student) => student.needsAttention)
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-red-100 text-red-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {student.course}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={student.progress}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-gray-600">
                              {student.progress}%
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                  {recentStudents
                    .filter((student) => !student.needsAttention)
                    .slice(0, 2)
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {student.course}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={student.progress}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-gray-600">
                              {student.progress}%
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700"
                        >
                          On Track
                        </Badge>
                      </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-white">
                  View All Students
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col bg-white hover:bg-blue-50"
                >
                  <Plus className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-sm">Create Course</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col bg-white hover:bg-green-50"
                >
                  <Video className="h-6 w-6 mb-2 text-green-600" />
                  <span className="text-sm">Upload Video</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col bg-white hover:bg-purple-50"
                >
                  <FileText className="h-6 w-6 mb-2 text-purple-600" />
                  <span className="text-sm">Add Resource</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col bg-white hover:bg-orange-50"
                >
                  <BarChart3 className="h-6 w-6 mb-2 text-orange-600" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <CourseManagement />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <StudentProgress />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TeachingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
