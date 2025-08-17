"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Users,
  Download,
  Star,
  MessageSquare,
  ThumbsUp,
  Eye,
  User,
  GraduationCap,
  Settings,
  LogOut,
  Shield,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSwitcher } from "./language-switcher";
import type { NavigationView } from "./navigation";

interface SidebarProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  currentView,
  onNavigate,
  onOpenSearch,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900">Rise Together</h1>
            <p className="text-sm text-gray-500">Inclusive Education</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search everything..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white cursor-pointer"
              onClick={onOpenSearch}
              readOnly
            />
          </div>
        </div>

        {user && (
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 p-2 justify-start hover:bg-gray-50"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-900">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 capitalize">
                        {t(`role.${user.role}`)}
                      </p>
                      {user.role === "admin" && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-red-100 text-red-600"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {user.role === "teacher" && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-600"
                        >
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Teacher
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => onNavigate("profile")}>
                  <User className="w-4 h-4 mr-2" />
                  {t("nav.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                {user.role === "teacher" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate("teacher")}>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Teacher Dashboard
                    </DropdownMenuItem>
                  </>
                )}
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => window.open("/admin", "_blank")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {t("nav.admin")}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div
          className={`grid gap-2 ${
            user?.role === "teacher" ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          <Button
            variant={currentView === "library" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onNavigate("library")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t("nav.dashboard")}
          </Button>
          <Button
            variant={currentView === "courses" ? "default" : "outline"}
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onNavigate("courses")}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            {t("nav.courses")}
          </Button>
          {user?.role === "teacher" && (
            <Button
              variant={currentView === "teacher" ? "default" : "outline"}
              size="sm"
              className="flex-1 bg-transparent col-span-2"
              onClick={() => onNavigate("teacher")}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Teaching Dashboard
            </Button>
          )}
          <Button
            variant={currentView === "forum" ? "default" : "outline"}
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onNavigate("forum")}
          >
            <Users className="w-4 h-4 mr-2" />
            {t("nav.forum")}
          </Button>
          <Button
            variant={currentView === "profile" ? "default" : "outline"}
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => onNavigate("profile")}
          >
            <User className="w-4 h-4 mr-2" />
            {t("nav.profile")}
          </Button>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          {t("dashboard.featured")}
        </h3>
        <div className="space-y-3">
          <Card
            className="p-3 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => onNavigate("courses")}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                  Sign Language Basics for Teachers
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  12 lessons • 3 hours
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Video
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="p-3 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => onNavigate("library")}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                  Kinyarwanda Stories Collection
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  15 stories • Grade 1-3
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Popular
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Braille
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Forum Posts */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          {t("dashboard.recent_posts")}
        </h3>
        <div className="space-y-3">
          <div
            className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => onNavigate("forum")}
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">JM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                Best practices for inclusive classroom setup?
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Jean Marie • 2 hours ago
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  12 replies
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  45 views
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => onNavigate("forum")}
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">AM</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                Looking for inclusive activities in Kigali
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Alice M • 5 hours ago
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />8 replies
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  23 views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Downloads */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full bg-transparent"
          size="sm"
          onClick={() => onNavigate("profile")}
        >
          <Download className="w-4 h-4 mr-2" />
          {t("dashboard.manage_downloads")}
        </Button>
      </div>
    </div>
  );
}
