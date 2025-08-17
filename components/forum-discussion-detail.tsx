"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  MoreHorizontal,
  Award,
  CheckCircle,
  Pin,
  Reply,
  Eye,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface ForumDiscussionDetailProps {
  discussionId: string;
  onBack: () => void;
}

export function ForumDiscussionDetail({
  discussionId,
  onBack,
}: ForumDiscussionDetailProps) {
  const [newReply, setNewReply] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [sortBy, setSortBy] = useState("oldest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Mock data - in real app, fetch by discussionId
  const discussion = {
    id: discussionId,
    title: "Best practices for inclusive classroom setup?",
    content:
      "I'm setting up my classroom for the new term and want to make sure it's accessible for all students. What are your recommendations for seating arrangements, visual aids, and technology setup?\n\nI have students with various needs including hearing impairments, visual impairments, and mobility challenges. I want to create an environment where everyone can participate fully.\n\nAny specific products, layouts, or strategies you'd recommend?",
    author: {
      name: "Jean Marie",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Teacher",
      initials: "JM",
      reputation: 245,
      joinDate: "March 2023",
      posts: 23,
    },
    category: "teaching",
    replies: 12,
    views: 145,
    likes: 8,
    dislikes: 0,
    timeAgo: "2 hours ago",
    isPinned: true,
    isAnswered: true,
    isClosed: false,
    tags: [
      "classroom-setup",
      "accessibility",
      "inclusive-education",
      "teaching-tips",
    ],
  };

  const answers = [
    {
      id: 1,
      content:
        "Great question! Here are some key recommendations based on my 15 years of teaching experience:\n\n**Seating Arrangements:**\n- Use flexible seating that can be easily rearranged\n- Ensure clear sight lines to the front for students who lip-read\n- Leave wide aisles for wheelchair accessibility\n- Consider U-shaped or semicircle arrangements for better interaction\n\n**Visual Aids:**\n- High contrast materials (black text on white/yellow backgrounds)\n- Large print options available\n- Digital displays with adjustable font sizes\n- Tactile materials for hands-on learning\n\n**Technology:**\n- FM systems for students with hearing aids\n- Screen readers compatible computers\n- Adjustable height desks\n- Good lighting throughout the room\n\nHappy to share more specific product recommendations if needed!",
      author: {
        name: "Marie Uwimana",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Special Education Teacher",
        initials: "MU",
        reputation: 892,
        isExpert: true,
      },
      timeAgo: "1 hour ago",
      likes: 15,
      dislikes: 0,
      isAccepted: true,
      replies: [
        {
          id: 11,
          content:
            "This is incredibly helpful! Could you share those specific product recommendations? Especially for the FM systems.",
          author: {
            name: "Jean Marie",
            avatar: "/placeholder.svg?height=32&width=32",
            role: "Teacher",
            initials: "JM",
          },
          timeAgo: "45 minutes ago",
          likes: 3,
          dislikes: 0,
        },
        {
          id: 12,
          content:
            "I second this! The U-shaped arrangement has worked wonders in my classroom. Students are much more engaged.",
          author: {
            name: "Paul Nkurunziza",
            avatar: "/placeholder.svg?height=32&width=32",
            role: "Teacher",
            initials: "PN",
          },
          timeAgo: "30 minutes ago",
          likes: 5,
          dislikes: 0,
        },
      ],
    },
    {
      id: 2,
      content:
        "I'd also add the importance of having a quiet corner or calm-down space for students who might get overwhelmed. Some students with autism or sensory processing issues really benefit from having a designated quiet area they can retreat to when needed.\n\nAlso consider:\n- Noise-reducing materials like carpets or acoustic panels\n- Consistent daily routines posted visually\n- Clear labeling with both text and pictures\n- Multiple ways to participate (verbal, written, digital)",
      author: {
        name: "Grace Uwimana",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Occupational Therapist",
        initials: "GU",
        reputation: 567,
      },
      timeAgo: "45 minutes ago",
      likes: 8,
      dislikes: 0,
      isAccepted: false,
      replies: [],
    },
    {
      id: 3,
      content:
        "Don't forget about lighting! Natural light is best, but if you need artificial lighting, avoid fluorescent lights as they can cause issues for some students with autism or visual processing disorders. LED lights with adjustable brightness work well.\n\nAlso, consider the color scheme of your classroom - neutral, calming colors work better than bright, stimulating ones for creating a focused learning environment.",
      author: {
        name: "Alice Mukamana",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Teacher",
        initials: "AM",
        reputation: 234,
      },
      timeAgo: "20 minutes ago",
      likes: 4,
      dislikes: 0,
      isAccepted: false,
      replies: [],
    },
  ];

  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortBy === "oldest") return a.id - b.id;
    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "most-liked") return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
          <div className="flex items-center gap-2">
            {discussion.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
            {discussion.isAnswered && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {discussion.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {discussion.views} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {discussion.replies} answers
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Asked {discussion.timeAgo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Discussion</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason for reporting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="inappropriate">
                        Inappropriate content
                      </SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="misinformation">
                        Misinformation
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Additional details (optional)" />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setShowReportDialog(false)}>
                      Submit Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Original Question */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={discussion.author.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {discussion.author.name}
                    </span>
                    <Badge variant="outline">{discussion.author.role}</Badge>
                    <span className="text-sm text-gray-500">
                      • {discussion.author.reputation} reputation
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                    {discussion.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {discussion.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        {discussion.dislikes}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Asked {discussion.timeAgo}</span>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {discussion.replies} Answer{discussion.replies !== 1 ? "s" : ""}
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="most-liked">Most liked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedAnswers.map((answer) => (
              <Card
                key={answer.id}
                className={
                  answer.isAccepted ? "border-green-200 bg-green-50/30" : ""
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={answer.author.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>{answer.author.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {answer.author.name}
                        </span>
                        <Badge variant="outline">{answer.author.role}</Badge>
                        {answer.author.isExpert && (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Award className="w-3 h-3 mr-1" />
                            Expert
                          </Badge>
                        )}
                        {answer.isAccepted && (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepted Answer
                          </Badge>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                        {answer.content.split("\n").map((paragraph, index) => (
                          <p key={index} className="mb-2">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            {answer.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            {answer.dislikes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(answer.id.toString())}
                          >
                            <Reply className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Answered {answer.timeAgo}</span>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Nested Replies */}
                      {answer.replies && answer.replies.length > 0 && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-4">
                          {answer.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start gap-3"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={
                                    reply.author.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {reply.author.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {reply.author.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {reply.author.role}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                  {reply.content}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                  >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                  <span>{reply.timeAgo}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === answer.id.toString() && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <Textarea
                            placeholder="Write your reply..."
                            className="mb-3"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                            >
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Answer */}
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your knowledge and help the community..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={6}
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>
                      Please be respectful and constructive in your response.
                    </p>
                  </div>
                  <Button disabled={!newReply.trim()}>Post Answer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
