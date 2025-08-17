"use client";

import { useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Search,
  Filter,
  X,
  BookOpen,
  Users,
  MessageSquare,
  FileText,
} from "lucide-react";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

interface SearchFilters {
  query: string;
  contentType: string[];
  categories: string[];
  subjects: string[];
  accessibilityFeatures: string[];
  difficulty: string;
  language: string;
  dateRange: string;
  sortBy: string;
  sortOrder: string;
}

export default function AdvancedSearch({
  onSearch,
  onClose,
}: AdvancedSearchProps) {
  const { t } = useLanguage();

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    contentType: [],
    categories: [],
    subjects: [],
    accessibilityFeatures: [],
    difficulty: "",
    language: "",
    dateRange: "",
    sortBy: "relevance",
    sortOrder: "desc",
  });

  const contentTypes = [
    { id: "courses", label: t("courses"), icon: BookOpen },
    { id: "resources", label: t("resources"), icon: FileText },
    { id: "discussions", label: t("discussions"), icon: MessageSquare },
    { id: "people", label: t("people"), icon: Users },
  ];

  const categories = [
    "mathematics",
    "languageArts",
    "science",
    "socialStudies",
    "signLanguage",
    "teacherTraining",
  ];

  const subjects = {
    mathematics: ["algebra", "geometry", "calculus", "statistics"],
    languageArts: ["reading", "writing", "grammar", "literature"],
    science: ["biology", "chemistry", "physics", "earthScience"],
    socialStudies: ["history", "geography", "civics", "economics"],
    signLanguage: ["basics", "intermediate", "advanced", "interpretation"],
    teacherTraining: [
      "inclusiveEducation",
      "assistiveTechnology",
      "curriculum",
      "assessment",
    ],
  };

  const accessibilityFeatures = [
    "braille",
    "audioDescription",
    "signLanguage",
    "tactileDiagrams",
    "highContrast",
    "largeText",
    "screenReader",
    "captions",
  ];

  const handleContentTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      contentType: checked
        ? [...prev.contentType, type]
        : prev.contentType.filter((t) => t !== type),
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
      subjects: checked
        ? prev.subjects
        : prev.subjects.filter(
            (s) => !subjects[category as keyof typeof subjects]?.includes(s)
          ),
    }));
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subject]
        : prev.subjects.filter((s) => s !== subject),
    }));
  };

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      accessibilityFeatures: checked
        ? [...prev.accessibilityFeatures, feature]
        : prev.accessibilityFeatures.filter((f) => f !== feature),
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      contentType: [],
      categories: [],
      subjects: [],
      accessibilityFeatures: [],
      difficulty: "",
      language: "",
      dateRange: "",
      sortBy: "relevance",
      sortOrder: "desc",
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.contentType.length +
      filters.categories.length +
      filters.subjects.length +
      filters.accessibilityFeatures.length +
      (filters.difficulty ? 1 : 0) +
      (filters.language ? 1 : 0) +
      (filters.dateRange ? 1 : 0)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("advancedSearch")}
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">{t("searchQuery")}</Label>
            <Input
              id="search-query"
              placeholder={t("enterSearchTerms")}
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
            />
          </div>

          {/* Content Type */}
          <div className="space-y-3">
            <Label>{t("contentType")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={filters.contentType.includes(type.id)}
                      onCheckedChange={(checked) =>
                        handleContentTypeChange(type.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={type.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>{t("categories")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={category} className="cursor-pointer">
                    {t(category)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects */}
          {filters.categories.length > 0 && (
            <div className="space-y-3">
              <Label>{t("subjects")}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filters.categories.flatMap(
                  (category) =>
                    subjects[category as keyof typeof subjects]?.map(
                      (subject) => (
                        <div
                          key={subject}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject}
                            checked={filters.subjects.includes(subject)}
                            onCheckedChange={(checked) =>
                              handleSubjectChange(subject, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={subject}
                            className="cursor-pointer text-sm"
                          >
                            {t(subject)}
                          </Label>
                        </div>
                      )
                    ) || []
                )}
              </div>
            </div>
          )}

          {/* Accessibility Features */}
          <div className="space-y-3">
            <Label>{t("accessibilityFeatures")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {accessibilityFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.accessibilityFeatures.includes(feature)}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange(feature, checked as boolean)
                    }
                  />
                  <Label htmlFor={feature} className="cursor-pointer text-sm">
                    {t(feature)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("difficulty")}</Label>
              <Select
                value={filters.difficulty}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDifficulty")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t("beginner")}</SelectItem>
                  <SelectItem value="intermediate">
                    {t("intermediate")}
                  </SelectItem>
                  <SelectItem value="advanced">{t("advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("language")}</Label>
              <Select
                value={filters.language}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("english")}</SelectItem>
                  <SelectItem value="rw">{t("kinyarwanda")}</SelectItem>
                  <SelectItem value="fr">{t("french")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("dateRange")}</Label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, dateRange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDateRange")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">{t("today")}</SelectItem>
                  <SelectItem value="week">{t("thisWeek")}</SelectItem>
                  <SelectItem value="month">{t("thisMonth")}</SelectItem>
                  <SelectItem value="year">{t("thisYear")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("sortBy")}</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t("relevance")}</SelectItem>
                  <SelectItem value="date">{t("date")}</SelectItem>
                  <SelectItem value="popularity">{t("popularity")}</SelectItem>
                  <SelectItem value="rating">{t("rating")}</SelectItem>
                  <SelectItem value="title">{t("title")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("sortOrder")}</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortOrder: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{t("descending")}</SelectItem>
                  <SelectItem value="asc">{t("ascending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              {t("clearFilters")}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {t("cancel")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
