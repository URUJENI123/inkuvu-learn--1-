"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Target,
  BookOpen,
  Eye,
  MessageSquare,
  Download,
  Award,
  AlertTriangle,
} from "lucide-react";

interface AnalyticsData {
  coursePerformance: CoursePerformance[];
  studentEngagement: EngagementMetrics;
  learningOutcomes: LearningOutcome[];
  timeAnalytics: TimeAnalytics;
  accessibilityUsage: AccessibilityMetrics;
}

interface CoursePerformance {
  courseId: string;
  courseName: string;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageScore: number;
  averageTimeSpent: number;
  dropoutRate: number;
  satisfactionRating: number;
  trend: "up" | "down" | "stable";
}

interface EngagementMetrics {
  dailyActiveUsers: number[];
  weeklyEngagement: number[];
  lessonCompletionTrends: number[];
  forumParticipation: number;
  resourceDownloads: number;
  videoWatchTime: number;
}

interface LearningOutcome {
  outcomeId: string;
  outcomeName: string;
  achievementRate: number;
  averageAttempts: number;
  difficulty: "easy" | "medium" | "hard";
  improvementNeeded: boolean;
}

interface TimeAnalytics {
  peakLearningHours: number[];
  averageSessionDuration: number;
  weeklyStudyPatterns: number[];
  monthlyTrends: number[];
}

interface AccessibilityMetrics {
  brailleUsage: number;
  audioUsage: number;
  signLanguageUsage: number;
  captionUsage: number;
  tactileUsage: number;
}

export function TeachingAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in real app, this would come from API
  const analyticsData: AnalyticsData = {
    coursePerformance: [
      {
        courseId: "1",
        courseName: "Sign Language Basics",
        totalStudents: 45,
        activeStudents: 38,
        completionRate: 78,
        averageScore: 87,
        averageTimeSpent: 25.5,
        dropoutRate: 12,
        satisfactionRating: 4.8,
        trend: "up",
      },
      {
        courseId: "2",
        courseName: "Inclusive Teaching Methods",
        totalStudents: 32,
        activeStudents: 28,
        completionRate: 65,
        averageScore: 82,
        averageTimeSpent: 32.8,
        dropoutRate: 18,
        satisfactionRating: 4.6,
        trend: "stable",
      },
      {
        courseId: "3",
        courseName: "Braille Reading Fundamentals",
        totalStudents: 28,
        activeStudents: 26,
        completionRate: 92,
        averageScore: 91,
        averageTimeSpent: 28.3,
        dropoutRate: 8,
        satisfactionRating: 4.9,
        trend: "up",
      },
    ],
    studentEngagement: {
      dailyActiveUsers: [
        12, 15, 18, 22, 19, 25, 28, 24, 30, 27, 32, 29, 35, 31,
      ],
      weeklyEngagement: [78, 82, 75, 88, 91, 85, 89],
      lessonCompletionTrends: [65, 68, 72, 75, 78, 82, 85],
      forumParticipation: 67,
      resourceDownloads: 234,
      videoWatchTime: 1247,
    },
    learningOutcomes: [
      {
        outcomeId: "1",
        outcomeName: "Basic Sign Recognition",
        achievementRate: 89,
        averageAttempts: 2.3,
        difficulty: "easy",
        improvementNeeded: false,
      },
      {
        outcomeId: "2",
        outcomeName: "Conversation Skills",
        achievementRate: 67,
        averageAttempts: 3.8,
        difficulty: "medium",
        improvementNeeded: true,
      },
      {
        outcomeId: "3",
        outcomeName: "Advanced Grammar",
        achievementRate: 45,
        averageAttempts: 4.2,
        difficulty: "hard",
        improvementNeeded: true,
      },
    ],
    timeAnalytics: {
      peakLearningHours: [
        2, 3, 5, 8, 12, 15, 18, 22, 25, 28, 24, 20, 16, 12, 8, 5, 3, 2, 1, 1, 1,
        1, 1, 2,
      ],
      averageSessionDuration: 45,
      weeklyStudyPatterns: [65, 78, 82, 88, 85, 72, 68],
      monthlyTrends: [78, 82, 85, 88, 91, 89],
    },
    accessibilityUsage: {
      brailleUsage: 23,
      audioUsage: 67,
      signLanguageUsage: 89,
      captionUsage: 78,
      tactileUsage: 34,
    },
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teaching Analytics
          </h1>
          <p className="text-gray-600">
            Insights into your course performance and student engagement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="1">Sign Language Basics</SelectItem>
              <SelectItem value="2">Inclusive Teaching Methods</SelectItem>
              <SelectItem value="3">Braille Reading Fundamentals</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.coursePerformance.reduce(
                    (acc, course) => acc + course.totalStudents,
                    0
                  )}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    analyticsData.coursePerformance.reduce(
                      (acc, course) => acc + course.completionRate,
                      0
                    ) / analyticsData.coursePerformance.length
                  )}
                  %
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Student Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    analyticsData.coursePerformance.reduce(
                      (acc, course) => acc + course.averageScore,
                      0
                    ) / analyticsData.coursePerformance.length
                  )}
                  %
                </p>
                <p className="text-sm text-yellow-600 flex items-center mt-1">
                  <div className="h-3 w-3 bg-yellow-400 rounded-full mr-1" />
                  Stable
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
                  Engagement Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.studentEngagement.forumParticipation}%
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Course Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.coursePerformance.map((course) => (
                    <div
                      key={course.courseId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {course.courseName}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(course.trend)}
                          <Badge variant="outline">
                            {course.totalStudents} students
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Completion Rate</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={course.completionRate}
                              className="flex-1 h-2"
                            />
                            <span className="font-medium">
                              {course.completionRate}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Score</p>
                          <p className="font-medium text-lg">
                            {course.averageScore}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Satisfaction</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">
                              {course.satisfactionRating}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Dropout Rate</p>
                          <p className="font-medium text-lg">
                            {course.dropoutRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Daily Active Students
                      </p>
                      <span className="text-sm text-green-600">
                        +15% vs last week
                      </span>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-2">
                      <div className="flex items-end space-x-1 h-full">
                        {analyticsData.studentEngagement.dailyActiveUsers
                          .slice(-7)
                          .map((value, index) => (
                            <div
                              key={index}
                              className="bg-blue-500 rounded-sm flex-1 max-w-[8px]"
                              style={{
                                height: `${
                                  (value /
                                    Math.max(
                                      ...analyticsData.studentEngagement
                                        .dailyActiveUsers
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Lesson Completion Trend
                      </p>
                      <span className="text-sm text-green-600">Improving</span>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-green-50 to-green-100 rounded-lg flex items-end justify-center p-2">
                      <div className="flex items-end space-x-1 h-full">
                        {analyticsData.studentEngagement.lessonCompletionTrends.map(
                          (value, index) => (
                            <div
                              key={index}
                              className="bg-green-500 rounded-sm flex-1 max-w-[8px]"
                              style={{
                                height: `${
                                  (value /
                                    Math.max(
                                      ...analyticsData.studentEngagement
                                        .lessonCompletionTrends
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">
                        Resource Downloads
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {analyticsData.studentEngagement.resourceDownloads}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Video Watch Time</p>
                      <p className="text-xl font-bold text-gray-900">
                        {analyticsData.studentEngagement.videoWatchTime}h
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.coursePerformance.map((course) => (
                      <div key={course.courseId} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {course.courseName}
                          </h4>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(course.trend)}
                            <span className="text-sm text-gray-600">
                              {course.totalStudents} students
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              Completion
                            </p>
                            <Progress
                              value={course.completionRate}
                              className="h-2"
                            />
                            <p className="text-xs font-medium mt-1">
                              {course.completionRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              Avg Score
                            </p>
                            <Progress
                              value={course.averageScore}
                              className="h-2"
                            />
                            <p className="text-xs font-medium mt-1">
                              {course.averageScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              Engagement
                            </p>
                            <Progress
                              value={100 - course.dropoutRate}
                              className="h-2"
                            />
                            <p className="text-xs font-medium mt-1">
                              {100 - course.dropoutRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">
                              Satisfaction
                            </p>
                            <Progress
                              value={(course.satisfactionRating / 5) * 100}
                              className="h-2"
                            />
                            <p className="text-xs font-medium mt-1">
                              {course.satisfactionRating}/5
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="p-1 bg-green-100 rounded">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Strong Performance
                        </p>
                        <p className="text-xs text-green-700">
                          Braille Reading course shows 92% completion rate
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="p-1 bg-yellow-100 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-900">
                          Needs Attention
                        </p>
                        <p className="text-xs text-yellow-700">
                          Inclusive Teaching has 18% dropout rate
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="p-1 bg-blue-100 rounded">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          High Satisfaction
                        </p>
                        <p className="text-xs text-blue-700">
                          Average rating of 4.8/5 across all courses
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Peak Learning Hours
                      </p>
                      <div className="h-16 bg-gray-50 rounded-lg flex items-end justify-center p-2">
                        <div className="flex items-end space-x-px h-full w-full">
                          {analyticsData.timeAnalytics.peakLearningHours.map(
                            (value, index) => (
                              <div
                                key={index}
                                className="bg-purple-400 flex-1"
                                style={{
                                  height: `${
                                    (value /
                                      Math.max(
                                        ...analyticsData.timeAnalytics
                                          .peakLearningHours
                                      )) *
                                    100
                                  }%`,
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Peak activity: 2-4 PM
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg Session Duration
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analyticsData.timeAnalytics.averageSessionDuration} min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Forum Participation
                      </p>
                      <span className="text-lg font-bold text-gray-900">
                        {analyticsData.studentEngagement.forumParticipation}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.studentEngagement.forumParticipation}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Resource Downloads
                      </p>
                      <span className="text-lg font-bold text-gray-900">
                        {analyticsData.studentEngagement.resourceDownloads}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      +23% from last month
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Video Watch Time
                      </p>
                      <span className="text-lg font-bold text-gray-900">
                        {analyticsData.studentEngagement.videoWatchTime}h
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Average 45 min per session
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center p-4">
                    <div className="flex items-end space-x-2 h-full w-full">
                      {analyticsData.studentEngagement.weeklyEngagement.map(
                        (value, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div
                              className="bg-blue-500 rounded-t w-full"
                              style={{
                                height: `${
                                  (value /
                                    Math.max(
                                      ...analyticsData.studentEngagement
                                        .weeklyEngagement
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              {
                                [
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                  "Sun",
                                ][index]
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Peak engagement on Thursday-Friday
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Outcomes Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.learningOutcomes.map((outcome) => (
                  <div
                    key={outcome.outcomeId}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {outcome.outcomeName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getDifficultyColor(outcome.difficulty)}
                        >
                          {outcome.difficulty}
                        </Badge>
                        {outcome.improvementNeeded && (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-700"
                          >
                            Needs Improvement
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Achievement Rate
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={outcome.achievementRate}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-medium">
                            {outcome.achievementRate}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Avg Attempts
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {outcome.averageAttempts}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Difficulty Level
                        </p>
                        <Badge
                          className={getDifficultyColor(outcome.difficulty)}
                        >
                          {outcome.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Sign Language Videos
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        {analyticsData.accessibilityUsage.signLanguageUsage}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.accessibilityUsage.signLanguageUsage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Captions
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        {analyticsData.accessibilityUsage.captionUsage}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.accessibilityUsage.captionUsage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Audio Descriptions
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        {analyticsData.accessibilityUsage.audioUsage}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.accessibilityUsage.audioUsage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Tactile Materials
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        {analyticsData.accessibilityUsage.tactileUsage}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.accessibilityUsage.tactileUsage}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600">
                        Braille Resources
                      </p>
                      <span className="text-sm font-bold text-gray-900">
                        {analyticsData.accessibilityUsage.brailleUsage}%
                      </span>
                    </div>
                    <Progress
                      value={analyticsData.accessibilityUsage.brailleUsage}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">
                        High Sign Language Usage
                      </p>
                    </div>
                    <p className="text-xs text-blue-700">
                      89% of students use sign language videos, indicating
                      strong demand for visual learning aids.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-green-900">
                        Caption Adoption
                      </p>
                    </div>
                    <p className="text-xs text-green-700">
                      78% caption usage shows good accessibility awareness among
                      students.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-900">
                        Braille Opportunity
                      </p>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Only 23% braille usage suggests potential for more braille
                      content promotion.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-medium text-purple-900">
                        Inclusive Success
                      </p>
                    </div>
                    <p className="text-xs text-purple-700">
                      Multiple accessibility features are actively used, showing
                      effective inclusive design.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
