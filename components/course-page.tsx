"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  Users,
  Star,
  Download,
  BookOpen,
  Hand,
  Headphones,
  FileText,
} from "lucide-react"
import { useState } from "react"

const courseData = {
  id: 1,
  title: "Sign Language Basics",
  subtitle: "Basic Greetings in Sign Language",
  description: "Learn essential Kinyarwanda sign language greetings and daily communication",
  instructor: "Marie Uwimana",
  duration: "2 hours 45 minutes",
  students: 1247,
  rating: 4.8,
  progress: 35,
  currentLesson: 3,
  totalLessons: 12,
  difficulty: "Beginner",
  language: "Kinyarwanda",
  formats: ["video", "sign-language", "text"],
}

const lessons = [
  {
    id: 1,
    title: "Introduction to Sign Language",
    duration: "8:45",
    completed: true,
    type: "video",
  },
  {
    id: 2,
    title: "Basic Hand Positions",
    duration: "12:30",
    completed: true,
    type: "video",
  },
  {
    id: 3,
    title: "Common Greetings",
    duration: "15:20",
    completed: false,
    current: true,
    type: "video",
  },
  {
    id: 4,
    title: "Family Members Signs",
    duration: "18:15",
    completed: false,
    type: "video",
  },
  {
    id: 5,
    title: "Numbers 1-20",
    duration: "14:30",
    completed: false,
    type: "video",
  },
  {
    id: 6,
    title: "Days of the Week",
    duration: "10:45",
    completed: false,
    type: "video",
  },
  {
    id: 7,
    title: "Practice Exercise 1",
    duration: "20:00",
    completed: false,
    type: "exercise",
  },
  {
    id: 8,
    title: "Colors in Sign Language",
    duration: "12:15",
    completed: false,
    type: "video",
  },
  {
    id: 9,
    title: "Common Phrases",
    duration: "16:30",
    completed: false,
    type: "video",
  },
  {
    id: 10,
    title: "Emotions and Feelings",
    duration: "13:45",
    completed: false,
    type: "video",
  },
  {
    id: 11,
    title: "Practice Exercise 2",
    duration: "25:00",
    completed: false,
    type: "exercise",
  },
  {
    id: 12,
    title: "Final Assessment",
    duration: "30:00",
    completed: false,
    type: "assessment",
  },
]

export function CoursePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)

  const currentLesson = lessons.find((lesson) => lesson.current)
  const completedLessons = lessons.filter((lesson) => lesson.completed).length

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Course Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Hand className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{courseData.title}</h1>
                <p className="text-sm text-gray-600">{courseData.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="flex items-center gap-2">
                  <Progress value={courseData.progress} className="w-32" />
                  <span className="text-sm font-medium text-gray-900">{courseData.progress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {completedLessons}/{courseData.totalLessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {courseData.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {courseData.students} students
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-black relative">
          <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
            {/* Video placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Hand className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Sign Language Video</p>
                <p className="text-sm opacity-75">Lesson 3: Common Greetings</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <span className="text-white text-sm">2:45</span>
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
                  </div>
                  <span className="text-white text-sm">15:20</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white hover:bg-white/20 ${showCaptions ? "bg-white/20" : ""}`}
                  onClick={() => setShowCaptions(!showCaptions)}
                >
                  <FileText className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Captions */}
            {showCaptions && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center">
                  <p className="text-sm">Hello, how are you today?</p>
                  <p className="text-xs opacity-75 mt-1">Muraho, amakuru?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Button>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{currentLesson?.title}</h3>
              <p className="text-sm text-gray-600">
                Lesson {courseData.currentLesson} of {courseData.totalLessons}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      In this lesson, you'll learn the most common greetings used in Kinyarwanda sign language. These
                      basic signs will help you start conversations and show respect in the deaf community.
                    </p>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">What you'll learn:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Basic greeting signs (Hello, Good morning, Good evening)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          How to ask "How are you?" in sign language
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Appropriate responses to greetings
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Cultural context and etiquette
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Practice Exercises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Exercise 1: Basic Greetings</h4>
                        <p className="text-sm text-blue-800">
                          Practice the signs for "Hello", "Good morning", and "Good evening" in front of a mirror.
                        </p>
                        <Button size="sm" className="mt-3">
                          Start Exercise
                        </Button>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Exercise 2: Conversation Practice</h4>
                        <p className="text-sm text-green-800">
                          Practice a complete greeting conversation with the interactive tool.
                        </p>
                        <Button size="sm" className="mt-3">
                          Start Exercise
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Captions</p>
                          <p className="text-xs text-gray-600">Kinyarwanda & English</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Headphones className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Audio Description</p>
                          <p className="text-xs text-gray-600">Detailed narration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Hand className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Sign Language</p>
                          <p className="text-xs text-gray-600">Clear demonstrations</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Course Info</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instructor:</span>
                        <span className="font-medium">{courseData.instructor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <Badge variant="outline">{courseData.difficulty}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{courseData.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{courseData.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Course Curriculum</h3>
          <p className="text-sm text-gray-600 mt-1">
            {completedLessons} of {courseData.totalLessons} lessons completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  lesson.current
                    ? "bg-blue-50 border-blue-200"
                    : lesson.completed
                      ? "bg-green-50 border-green-200 hover:bg-green-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : lesson.current ? (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm line-clamp-2 ${
                        lesson.current ? "text-blue-900" : lesson.completed ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {index + 1}. {lesson.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">{lesson.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {lesson.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button className="w-full">
            Continue Learning
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
