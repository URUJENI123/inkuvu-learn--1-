"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
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
  Bell,
  EyeOff,
  Trash2,
  Share2,
  Bookmark,
  Heart,
  BarChart3,
  Target,
  Zap,
  Monitor,
  Smartphone,
  Key,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

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
    {
      id: 1,
      name: "Course Completionist",
      description: "Completed 10+ courses",
      icon: BookOpen,
      earned: true,
    },
    {
      id: 2,
      name: "Community Helper",
      description: "Provided 15+ helpful answers",
      icon: Users,
      earned: true,
    },
    {
      id: 3,
      name: "Resource Collector",
      description: "Downloaded 25+ resources",
      icon: Download,
      earned: true,
    },
    {
      id: 4,
      name: "Discussion Starter",
      description: "Started 10+ discussions",
      icon: MessageSquare,
      earned: false,
    },
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
};

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
  const [contrast, setContrast] = useState([50]);
  const [volume, setVolume] = useState([75]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userData.name}
              </h1>
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
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            <Dialog open={showExportData} onOpenChange={setShowExportData}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Your Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Download your personal data including courses, achievements,
                    and activity history.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Course Data</p>
                          <p className="text-sm text-gray-600">
                            Progress, certificates, notes
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Forum Activity</p>
                          <p className="text-sm text-gray-600">
                            Posts, comments, discussions
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Achievements</p>
                          <p className="text-sm text-gray-600">
                            Badges, certificates, milestones
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full">Download All Data</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            <Dialog
              open={showNotificationSettings}
              onOpenChange={setShowNotificationSettings}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Course Updates</Label>
                      <p className="text-sm text-gray-600">
                        New lessons and announcements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Forum Replies</Label>
                      <p className="text-sm text-gray-600">
                        Responses to your posts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Achievement Unlocked</Label>
                      <p className="text-sm text-gray-600">
                        New badges and milestones
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-gray-600">
                        Progress reports via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-gray-600">
                        New features and promotions
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
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
                            <Textarea
                              id="bio"
                              defaultValue={userData.bio}
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-4">
                            <Button>Save Changes</Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
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
                          const IconComponent = activity.icon;
                          return (
                            <div
                              key={activity.id}
                              className="flex items-start gap-3"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900">
                                  {activity.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {activity.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.timestamp}
                                </p>
                              </div>
                            </div>
                          );
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
                            <span className="text-sm text-gray-600">
                              Courses Completed
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {userData.stats.coursesCompleted}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              Resources Downloaded
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {userData.stats.resourcesDownloaded}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              Forum Posts
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {userData.stats.forumPosts}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-gray-600">
                              Helpful Answers
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {userData.stats.helpfulAnswers}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Downloaded Content
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Saved Resources
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          My Discussions
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Liked Content
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Certificates
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Learning Analytics
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help Center
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              Complete 5 courses this month
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">3/5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">
                              7-day learning streak
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">5/7</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span className="text-sm">
                              Help 10 community members
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">8/10</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-3 bg-transparent"
                        >
                          Set New Goals
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
                      const IconComponent = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card
                      key={achievement.id}
                      className={`${
                        achievement.earned
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              achievement.earned
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${
                                achievement.earned
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className={`font-medium ${
                                  achievement.earned
                                    ? "text-green-900"
                                    : "text-gray-500"
                                }`}
                              >
                                {achievement.name}
                              </h3>
                              {achievement.earned && (
                                <Badge className="bg-green-100 text-green-800">
                                  Earned
                                </Badge>
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                achievement.earned
                                  ? "text-green-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
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
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userData.email}
                      />
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
                          <SelectItem value="administrator">
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={userData.location} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 xxx xxx xxx"
                      />
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
                        <p className="text-sm text-gray-600">
                          Receive updates about courses and discussions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Forum Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Get notified about replies to your posts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Reminders about incomplete courses
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mobile Push Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Notifications on your mobile device
                        </p>
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
                          <SelectItem value="kinyarwanda">
                            Kinyarwanda
                          </SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Timezone</Label>
                      <Select defaultValue="africa/kigali">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa/kigali">
                            Africa/Kigali (CAT)
                          </SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="europe/london">
                            Europe/London (GMT)
                          </SelectItem>
                          <SelectItem value="america/new_york">
                            America/New_York (EST)
                          </SelectItem>
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
                        <p className="text-sm text-gray-600">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Large Text</Label>
                        <p className="text-sm text-gray-600">
                          Increase font size throughout the platform
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div>
                      <Label>Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <Label>Contrast Level: {contrast[0]}%</Label>
                      <Slider
                        value={contrast}
                        onValueChange={setContrast}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full mt-2"
                      />
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
                          <SelectItem value="extra-large">
                            Extra Large
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Color Theme</Label>
                      <Select defaultValue="default">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="high-contrast">
                            High Contrast
                          </SelectItem>
                          <SelectItem value="colorblind">
                            Colorblind Friendly
                          </SelectItem>
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
                        <p className="text-sm text-gray-600">
                          Enhanced compatibility with screen readers
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Keyboard Navigation</Label>
                        <p className="text-sm text-gray-600">
                          Navigate using keyboard shortcuts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-play Videos</Label>
                        <p className="text-sm text-gray-600">
                          Automatically play video content
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Captions by Default</Label>
                        <p className="text-sm text-gray-600">
                          Show captions on all video content
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label>Default Volume: {volume[0]}%</Label>
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full mt-2"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Audio Descriptions</Label>
                        <p className="text-sm text-gray-600">
                          Detailed audio descriptions for visual content
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sign Language Support</Label>
                        <p className="text-sm text-gray-600">
                          Show sign language interpreters
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Braille Support</Label>
                        <p className="text-sm text-gray-600">
                          Enhanced braille display compatibility
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Profile</Label>
                        <p className="text-sm text-gray-600">
                          Allow others to view your profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Activity Status</Label>
                        <p className="text-sm text-gray-600">
                          Let others see when you're online
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Course Progress</Label>
                        <p className="text-sm text-gray-600">
                          Display your learning progress publicly
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Achievements</Label>
                        <p className="text-sm text-gray-600">
                          Display your badges and certificates
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Learning Analytics</Label>
                        <p className="text-sm text-gray-600">
                          Allow collection of learning data for insights
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Usage Statistics</Label>
                        <p className="text-sm text-gray-600">
                          Help improve the platform with usage data
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Personalized Recommendations</Label>
                        <p className="text-sm text-gray-600">
                          Use your data to suggest relevant content
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Communication Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Direct Messages</Label>
                        <p className="text-sm text-gray-600">
                          Let other users send you private messages
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label>Who can contact you</Label>
                      <Select defaultValue="everyone">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="students-teachers">
                            Students & Teachers Only
                          </SelectItem>
                          <SelectItem value="teachers">
                            Teachers Only
                          </SelectItem>
                          <SelectItem value="none">No One</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Change Password</Label>
                        <p className="text-sm text-gray-600">
                          Update your account password
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-gray-600">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Desktop - Chrome</p>
                            <p className="text-sm text-gray-600">
                              Kigali, Rwanda • Current session
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">Mobile - Safari</p>
                            <p className="text-sm text-gray-600">
                              Kigali, Rwanda • 2 hours ago
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Download Account Data</Label>
                        <p className="text-sm text-gray-600">
                          Get a copy of all your data
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Deactivate Account</Label>
                        <p className="text-sm text-gray-600">
                          Temporarily disable your account
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Deactivate
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-red-600">Delete Account</Label>
                        <p className="text-sm text-gray-600">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Dialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-red-600">
                              Delete Account
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-900">
                                  This action cannot be undone
                                </p>
                                <p className="text-sm text-red-700">
                                  All your courses, progress, achievements, and
                                  forum posts will be permanently deleted.
                                </p>
                              </div>
                            </div>
                            <div>
                              <Label>Type "DELETE" to confirm</Label>
                              <Input placeholder="DELETE" />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button variant="destructive">
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
