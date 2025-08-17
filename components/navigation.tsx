"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { DigitalLibrary } from "./digital-library";
import { CoursePage } from "./course-page";
import { CommunityForum } from "./community-forum";
import { UserProfile } from "./user-profile";
import { TeachersDashboard } from "./teachers/teachers-dashboard";
import { GlobalSearch } from "./global-search";

export type NavigationView =
  | "library"
  | "courses"
  | "forum"
  | "profile"
  | "teacher";

interface NavigationProps {
  initialView?: NavigationView;
}

export function Navigation({ initialView = "library" }: NavigationProps) {
  const [currentView, setCurrentView] = useState<NavigationView>(initialView);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const renderMainContent = () => {
    switch (currentView) {
      case "library":
        return <DigitalLibrary />;
      case "courses":
        return <CoursePage />;
      case "forum":
        return <CommunityForum />;
      case "profile":
        return <UserProfile />;
      case "teacher":
        return <TeachersDashboard />;
      default:
        return <DigitalLibrary />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenSearch={() => setShowGlobalSearch(true)}
      />
      {renderMainContent()}

      {showGlobalSearch && (
        <GlobalSearch onClose={() => setShowGlobalSearch(false)} />
      )}
    </div>
  );
}
