"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  Clock,
  Pin,
  Star,
  Filter,
  TrendingUp,
  Users,
  Heart,
  Reply,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"

const forumCategories = [
  { id: "all", name: "All Discussions", count: 156, color: "blue" },
  { id: "teaching", name: "Teaching Methods", count: 45, color: "green" },
  { id: "resources", name: "Resource Sharing", count: 38, color: "purple" },
  { id: "sign-language", name: "Sign Language", count: 29, color: "orange" },
  { id: "support", name: "Parent Support", count: 23, color: "pink" },
  { id: "technology", name: "Technology Help", count: 21, color: "indigo" },
]

const featuredDiscussions = [
  {
    id: 1,
    title: "Best practices for inclusive classroom setup?",
    content:
      "I'm setting up my classroom for the new term and want to make sure it's accessible for all students. What are your recommendations for seating arrangements, visual aids, and technology setup?",
    author: {
      name: "Jean Marie",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Teacher",
      initials: "JM",
    },
    category: "teaching",
    replies: 12,
    views: 145,
    likes: 8,
    timeAgo: "2 hours ago",
    isPinned: true,
    isAnswered: true,
  },
  {
    id: 2,
    title: "Success story: My daughter's progress with sign language",
    content:
      "I wanted to share how much progress my 8-year-old daughter has made using the sign language resources from Inkuvu Learn. She can now communicate basic needs and is much more confident in school.",
    author: {
      name: "Marie Uwimana",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Parent",
      initials: "MU",
    },
    category: "support",
    replies: 18,
    views: 203,
    likes: 25,
    timeAgo: "4 hours ago",
    isPinned: false,
    isAnswered: false,
  },
  {
    id: 3,
    title: "Need help with braille teaching materials",
    content:
      "I'm looking for recommendations on where to find quality braille teaching materials for mathematics. The ones I have are quite old and I'd like to update my resources.",
    author: {
      name: "Alice Mukamana",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Teacher",
      initials: "AM",
    },
    category: "resources",
    replies: 7,
    views: 89,
    likes: 5,
    timeAgo: "6 hours ago",
    isPinned: false,
    isAnswered: true,
  },
]

const recentDiscussions = [
  {
    id: 4,
    title: "Looking for inclusive school recommendations in Kigali",
    content:
      "My family is moving to Kigali and I need to find a good inclusive school for my son who has hearing difficulties. Any suggestions?",
    author: {
      name: "Paul Nkurunziza",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Parent",
      initials: "PN",
    },
    category: "support",
    replies: 15,
    views: 167,
    likes: 12,
    timeAgo: "1 day ago",
    isPinned: false,
    isAnswered: false,
  },
  {
    id: 5,
    title: "Free workshop: Kinyarwanda sign language basics",
    content:
      "I'm organizing a free weekend workshop for parents and teachers interested in learning basic Kinyarwanda sign language. Who would be interested?",
    author: {
      name: "Grace Uwimana",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Instructor",
      initials: "GU",
    },
    category: "sign-language",
    replies: 23,
    views: 298,
    likes: 31,
    timeAgo: "2 days ago",
    isPinned: false,
    isAnswered: false,
  },
  {
    id: 6,
    title: "Technology recommendations for visually impaired students",
    content:
      "What are the best screen readers and assistive technologies you recommend for students with visual impairments? Looking for both free and paid options.",
    author: {
      name: "Emmanuel Nzeyimana",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Teacher",
      initials: "EN",
    },
    category: "technology",
    replies: 9,
    views: 134,
    likes: 7,
    timeAgo: "3 days ago",
    isPinned: false,
    isAnswered: true,
  },
]

function getCategoryColor(category: string) {
  const cat = forumCategories.find((c) => c.id === category)
  return cat?.color || "gray"
}

export function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showNewPost, setShowNewPost] = useState(false)

  const allDiscussions = [...featuredDiscussions, ...recentDiscussions]
  const filteredDiscussions =
    selectedCategory === "all" ? allDiscussions : allDiscussions.filter((d) => d.category === selectedCategory)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600 mt-1">Connect with teachers, parents, and experts in inclusive education</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search discussions..." className="pl-10 w-80" />
            </div>
            <Button onClick={() => setShowNewPost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>156 discussions</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>1,247 members</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>23 active today</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Categories Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              {forumCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-white transition-colors ${
                    selectedCategory === category.id ? "bg-white text-blue-600 font-medium" : "text-gray-700"
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Pin className="w-4 h-4 text-blue-600" />
                  Pinned Posts
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <Star className="w-4 h-4 text-yellow-600" />
                  My Favorites
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white transition-colors">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  My Posts
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="discussions" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="discussions">All Discussions</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                      <SelectItem value="views">Most Views</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="discussions" className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {discussion.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                              <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                {discussion.title}
                              </h3>
                              {discussion.isAnswered && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Answered
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{discussion.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{discussion.author.name}</span>
                                <span>•</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs bg-${getCategoryColor(discussion.category)}-50 text-${getCategoryColor(discussion.category)}-700 border-${getCategoryColor(discussion.category)}-200`}
                                >
                                  {discussion.author.role}
                                </Badge>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {discussion.timeAgo}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                {discussion.replies}
                              </button>
                              <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                <Heart className="w-4 h-4" />
                                {discussion.likes}
                              </button>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {discussion.views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="featured" className="space-y-4">
                {featuredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                              {discussion.title}
                            </h3>
                            {discussion.isAnswered && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Answered
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{discussion.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{discussion.author.name}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {discussion.author.role}
                              </Badge>
                              <span>•</span>
                              <span>{discussion.timeAgo}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {discussion.replies}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {discussion.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {discussion.views}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4">
                {filteredDiscussions
                  .filter((d) => !d.isAnswered)
                  .map((discussion) => (
                    <Card
                      key={discussion.id}
                      className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                {discussion.title}
                              </h3>
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Needs Answer
                              </Badge>
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{discussion.content}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{discussion.author.name}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {discussion.author.role}
                                </Badge>
                                <span>•</span>
                                <span>{discussion.timeAgo}</span>
                              </div>

                              <Button size="sm" variant="outline">
                                <Reply className="w-4 h-4 mr-2" />
                                Answer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Start a New Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {forumCategories.slice(1).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <Input placeholder="What would you like to discuss?" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <Textarea placeholder="Provide more details about your question or topic..." rows={6} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewPost(false)}>Post Discussion</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
