"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Eye,
  Send,
  BookOpen,
  Target,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: StudentCourse[];
  overallProgress: number;
  lastActive: string;
  status: "active" | "inactive" | "at-risk";
  totalLessonsCompleted: number;
  averageScore: number;
  timeSpent: number; // in hours
  joinDate: string;
}

interface StudentCourse {
  courseId: string;
  courseName: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastAccessed: string;
  averageScore: number;
  timeSpent: number;
  status: "on-track" | "behind" | "completed" | "not-started";
  nextLesson?: string;
}

interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  attempts: number;
  lastAttempt: string;
}

export function StudentProgress() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  const students: Student[] = [
    {
      id: "1",
      name: "Marie Uwimana",
      email: "marie.uwimana@example.com",
      avatar: "/placeholder.svg",
      overallProgress: 85,
      lastActive: "2 hours ago",
      status: "active",
      totalLessonsCompleted: 34,
      averageScore: 92,
      timeSpent: 45.5,
      joinDate: "2024-01-15",
      enrolledCourses: [
        {
          courseId: "1",
          courseName: "Sign Language Basics",
          progress: 85,
          lessonsCompleted: 17,
          totalLessons: 20,
          lastAccessed: "2 hours ago",
          averageScore: 94,
          timeSpent: 25.5,
          status: "on-track",
          nextLesson: "Advanced Conversations",
        },
        {
          courseId: "2",
          courseName: "Inclusive Teaching Methods",
          progress: 60,
          lessonsCompleted: 12,
          totalLessons: 20,
          lastAccessed: "1 day ago",
          averageScore: 88,
          timeSpent: 20,
          status: "on-track",
          nextLesson: "Classroom Adaptations",
        },
      ],
    },
    {
      id: "2",
      name: "Jean Baptiste Nzeyimana",
      email: "jean.baptiste@example.com",
      overallProgress: 45,
      lastActive: "3 days ago",
      status: "at-risk",
      totalLessonsCompleted: 18,
      averageScore: 76,
      timeSpent: 22.3,
      joinDate: "2024-02-01",
      enrolledCourses: [
        {
          courseId: "1",
          courseName: "Sign Language Basics",
          progress: 45,
          lessonsCompleted: 9,
          totalLessons: 20,
          lastAccessed: "3 days ago",
          averageScore: 76,
          timeSpent: 15.3,
          status: "behind",
          nextLesson: "Family Signs",
        },
        {
          courseId: "3",
          courseName: "Braille Reading Fundamentals",
          progress: 30,
          lessonsCompleted: 6,
          totalLessons: 20,
          lastAccessed: "5 days ago",
          averageScore: 82,
          timeSpent: 7,
          status: "behind",
          nextLesson: "Letter Recognition",
        },
      ],
    },
    {
      id: "3",
      name: "Alice Mukamana",
      email: "alice.mukamana@example.com",
      overallProgress: 92,
      lastActive: "30 minutes ago",
      status: "active",
      totalLessonsCompleted: 46,
      averageScore: 96,
      timeSpent: 62.8,
      joinDate: "2023-12-10",
      enrolledCourses: [
        {
          courseId: "1",
          courseName: "Sign Language Basics",
          progress: 100,
          lessonsCompleted: 20,
          totalLessons: 20,
          lastAccessed: "1 week ago",
          averageScore: 98,
          timeSpent: 30,
          status: "completed",
        },
        {
          courseId: "2",
          courseName: "Inclusive Teaching Methods",
          progress: 85,
          lessonsCompleted: 17,
          totalLessons: 20,
          lastAccessed: "30 minutes ago",
          averageScore: 94,
          timeSpent: 32.8,
          status: "on-track",
          nextLesson: "Assessment Strategies",
        },
      ],
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    const matchesCourse =
      filterCourse === "all" ||
      student.enrolledCourses.some(
        (course) => course.courseId === filterCourse
      );

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "at-risk":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-700";
      case "behind":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "not-started":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSendMessage = () => {
    if (messageContent.trim() && selectedStudent) {
      // Here you would typically send the message via API
      console.log(
        `Sending message to ${selectedStudent.name}: ${messageContent}`
      );
      setMessageContent("");
      setShowMessageDialog(false);
    }
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        {/* Student Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
              ← Back to Students
            </Button>
            <Avatar className="h-16 w-16">
              <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {selectedStudent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedStudent.name}
              </h1>
              <p className="text-gray-600">{selectedStudent.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(selectedStudent.status)}>
                  {selectedStudent.status.replace("-", " ")}
                </Badge>
                <span className="text-sm text-gray-500">
                  Joined{" "}
                  {new Date(selectedStudent.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowMessageDialog(true)}
              className="bg-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="bg-white">
              <Eye className="h-4 w-4 mr-2" />
              View as Student
            </Button>
          </div>
        </div>

        {/* Student Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Overall Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedStudent.overallProgress}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress
                value={selectedStudent.overallProgress}
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Lessons Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedStudent.totalLessonsCompleted}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedStudent.averageScore}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Time Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedStudent.timeSpent}h
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedStudent.enrolledCourses.map((course) => (
                <div key={course.courseId} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.courseName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.lessonsCompleted} of {course.totalLessons}{" "}
                        lessons completed
                      </p>
                    </div>
                    <Badge className={getCourseStatusColor(course.status)}>
                      {course.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={course.progress} className="flex-1" />
                        <span className="text-sm font-medium">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Average Score
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {course.averageScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time Spent</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {course.timeSpent}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Last Accessed
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {course.lastAccessed}
                      </p>
                    </div>
                  </div>

                  {course.nextLesson && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900">
                        Next Lesson
                      </p>
                      <p className="text-sm text-blue-700">
                        {course.nextLesson}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {selectedStudent.name}</DialogTitle>
              <DialogDescription>
                Send a personalized message to help guide their learning
                journey.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMessageDialog(false)}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Progress</h1>
          <p className="text-gray-600">
            Monitor and track your students' learning journey
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message All
          </Button>
          <Button variant="outline" className="bg-white">
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="1">Sign Language Basics</SelectItem>
                <SelectItem value="2">Inclusive Teaching Methods</SelectItem>
                <SelectItem value="3">Braille Reading Fundamentals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s) => s.status === "active").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s) => s.status === "at-risk").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    students.reduce((acc, s) => acc + s.overallProgress, 0) /
                      students.length
                  )}
                  %
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedStudent(student)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{student.email}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {student.enrolledCourses.length} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {student.totalLessonsCompleted} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {student.lastActive}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Progress
                      value={student.overallProgress}
                      className="w-24"
                    />
                    <span className="text-sm font-medium min-w-[3rem]">
                      {student.overallProgress}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{student.averageScore}% avg</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(student);
                      setShowMessageDialog(true);
                    }}
                    className="bg-white"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
