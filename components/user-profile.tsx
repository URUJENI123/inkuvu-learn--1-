"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Edit,
  BookOpen,
  Download,
  MessageSquare,
  Award,
  Calendar,
  MapPin,
  HelpCircle,
  Camera,
  Star,
  Users,
  Clock,
} from "lucide-react"
import { useState } from "react"

const userData = {
  id: 1,
  name: "Jean Baptiste Nzeyimana",
  email: "jean.baptiste@email.com",
  role: "Special Needs Teacher",
  location: "Kigali, Rwanda",
  joinDate: "March 2023",
  bio: "Passionate about inclusive education with 8 years of experience teaching students with disabilities. Advocate for accessible learning resources.",
  avatar: "/placeholder.svg?height=120&width=120",
  initials: "JB",
  stats: {
    coursesCompleted: 12,
    resourcesDownloaded: 45,
    forumPosts: 23,
    helpfulAnswers: 18,
  },
  achievements: [
    { id: 1, name: "Course Completionist", description: "Completed 10+ courses", icon: BookOpen, earned: true },
    { id: 2, name: "Community Helper", description: "Provided 15+ helpful answers", icon: Users, earned: true },
    { id: 3, name: "Resource Collector", description: "Downloaded 25+ resources", icon: Download, earned: true },
    { id: 4, name: "Discussion Starter", description: "Started 10+ discussions", icon: MessageSquare, earned: false },
  ],
  recentActivity: [
    {
      id: 1,
      type: "course_completed",
      title: "Completed 'Sign Language Basics'",
      description: "Earned certificate in basic sign language communication",
      timestamp: "2 hours ago",
      icon: Award,
    },
    {
      id: 2,
      type: "resource_downloaded",
      title: "Downloaded 'Braille Teaching Guide'",
      description: "Mathematics teaching materials for Grade 4",
      timestamp: "1 day ago",
      icon: Download,
    },
    {
      id: 3,
      type: "forum_post",
      title: "Posted in Teaching Methods",
      description: "Shared classroom setup tips for inclusive learning",
      timestamp: "2 days ago",
      icon: MessageSquare,
    },
    {
      id: 4,
      type: "course_started",
      title: "Started 'Inclusive Teaching Methods'",
      description: "Professional development course for educators",
      timestamp: "3 days ago",
      icon: BookOpen,
    },
  ],
}

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">{userData.initials}</AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.role}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {userData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {userData.joinDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" defaultValue={userData.bio} rows={4} />
                          </div>
                          <div className="flex gap-4">
                            <Button>Save Changes</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">{userData.bio}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userData.recentActivity.map((activity) => {
                          const IconComponent = activity.icon
                          return (
                            <div key={activity.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.timestamp}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Courses Completed</span>
                          </div>
                          <span className="font-semibold text-gray-900">{userData.stats.coursesCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Resources Downloaded</span>
                          </div>
                          <span className="font-semibold text-gray-900">{userData.stats.resourcesDownloaded}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600">Forum Posts</span>
                          </div>
                          <span className="font-semibold text-gray-900">{userData.stats.forumPosts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-gray-600">Helpful Answers</span>
                          </div>
                          <span className="font-semibold text-gray-900">{userData.stats.helpfulAnswers}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Downloaded Content
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          My Discussions
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Award className="w-4 h-4 mr-2" />
                          Certificates
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help Center
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userData.recentActivity.map((activity) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon
                  return (
                    <Card
                      key={achievement.id}
                      className={`${achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              achievement.earned ? "bg-green-100" : "bg-gray-100"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-medium ${achievement.earned ? "text-green-900" : "text-gray-500"}`}>
                                {achievement.name}
                              </h3>
                              {achievement.earned && <Badge className="bg-green-100 text-green-800">Earned</Badge>}
                            </div>
                            <p className={`text-sm ${achievement.earned ? "text-green-700" : "text-gray-500"}`}>
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={userData.email} />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select defaultValue="teacher">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="administrator">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={userData.location} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive updates about courses and discussions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Forum Notifications</Label>
                        <p className="text-sm text-gray-600">Get notified about replies to your posts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course Reminders</Label>
                        <p className="text-sm text-gray-600">Reminders about incomplete courses</p>
                      </div>
                      <Switch />
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select defaultValue="kinyarwanda">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>High Contrast Mode</Label>
                        <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Large Text</Label>
                        <p className="text-sm text-gray-600">Increase font size throughout the platform</p>
                      </div>
                      <Switch />
                    </div>
                    <div>
                      <Label>Text Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audio & Motor Accessibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Screen Reader Support</Label>
                        <p className="text-sm text-gray-600">Enhanced compatibility with screen readers</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Keyboard Navigation</Label>
                        <p className="text-sm text-gray-600">Navigate using keyboard shortcuts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-play Videos</Label>
                        <p className="text-sm text-gray-600">Automatically play video content</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Captions by Default</Label>
                        <p className="text-sm text-gray-600">Show captions on all video content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
