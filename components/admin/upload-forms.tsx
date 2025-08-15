"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { Upload, Video, BookOpen, FileText, X, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface UploadFormsProps {
  onUploadComplete?: () => void;
}

export function UploadForms({ onUploadComplete }: UploadFormsProps) {
  const { t } = useLanguage();
  const [activeForm, setActiveForm] = useState<
    "course" | "video" | "resource" | null
  >(null);

  return (
    <div className="space-y-4">
      {/* Course Upload Form */}
    <Dialog
      open={activeForm === "course"}
      onOpenChange={(open: boolean) => !open && setActiveForm(null)}
    >
      <DialogTrigger asChild>
        <Button
        onClick={() => setActiveForm("course")}
        className="w-full justify-start"
        variant="outline"
        >
        <BookOpen className="w-4 h-4 mr-2" />
        Upload Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Create New Course
        </DialogTitle>
        </DialogHeader>
        <CourseUploadForm
        onComplete={() => {
          setActiveForm(null);
          onUploadComplete?.();
        }}
        />
      </DialogContent>
    </Dialog>

      {/* Video Upload Form */}
    <Dialog
      open={activeForm === "video"}
      onOpenChange={(open: boolean) => !open && setActiveForm(null)}
    >
      <DialogTrigger asChild>
        <Button
        onClick={() => setActiveForm("video")}
        className="w-full justify-start"
        variant="outline"
        >
        <Video className="w-4 h-4 mr-2" />
        Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Upload New Video
        </DialogTitle>
        </DialogHeader>
        <VideoUploadForm
        onComplete={() => {
          setActiveForm(null);
          onUploadComplete?.();
        }}
        />
      </DialogContent>
    </Dialog>

      {/* Resource Upload Form */}
    <Dialog
      open={activeForm === "resource"}
      onOpenChange={(open: boolean) => !open && setActiveForm(null)}
    >
      <DialogTrigger asChild>
        <Button
        onClick={() => setActiveForm("resource")}
        className="w-full justify-start"
        variant="outline"
        >
        <FileText className="w-4 h-4 mr-2" />
        Upload Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Add New Resource
        </DialogTitle>
        </DialogHeader>
        <ResourceUploadForm
        onComplete={() => {
          setActiveForm(null);
          onUploadComplete?.();
        }}
        />
      </DialogContent>
    </Dialog>
    </div>
  );
}

// Course Upload Form Component
function CourseUploadForm({ onComplete }: { onComplete: () => void }) {
  const [lessons, setLessons] = useState<
    { title: string; duration: string; videoFile: File | null }[]
  >([
    { title: "", duration: "", videoFile: null },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    language: "",
    thumbnail: null as File | null,
  });

  const addLesson = () => {
    setLessons([...lessons, { title: "", duration: "", videoFile: null }]);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle course upload logic here
    console.log("Course data:", formData, lessons);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="course-title">Course Title</Label>
          <Input
            id="course-title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter course title"
            required
          />
        </div>
        <div>
          <Label htmlFor="course-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="language">Language Arts</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="social-studies">Social Studies</SelectItem>
              <SelectItem value="special-education">
                Special Education
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="course-description">Description</Label>
        <Textarea
          id="course-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the course content and objectives"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) =>
              setFormData({ ...formData, difficulty: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="rw">Kinyarwanda</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="thumbnail">Course Thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Course Lessons</Label>
          <Button type="button" onClick={addLesson} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`lesson-title-${index}`}>
                        Lesson {index + 1} Title
                      </Label>
                      <Input
                        id={`lesson-title-${index}`}
                        value={lesson.title}
                        onChange={(e) => {
                          const newLessons = [...lessons];
                          newLessons[index].title = e.target.value;
                          setLessons(newLessons);
                        }}
                        placeholder="Enter lesson title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`lesson-duration-${index}`}>
                          Duration (minutes)
                        </Label>
                        <Input
                          id={`lesson-duration-${index}`}
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => {
                            const newLessons = [...lessons];
                            newLessons[index].duration = e.target.value;
                            setLessons(newLessons);
                          }}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lesson-video-${index}`}>
                          Video File
                        </Label>
                        <Input
                          id={`lesson-video-${index}`}
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const newLessons = [...lessons];
                            newLessons[index].videoFile =
                              e.target.files?.[0] || null;
                            setLessons(newLessons);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {lessons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLesson(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          <Upload className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>
    </form>
  );
}

// Video Upload Form Component
function VideoUploadForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    language: "",
    accessibility: [] as string[],
    videoFile: null as File | null,
    thumbnail: null as File | null,
    captions: null as File | null,
  });

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        accessibility: [...formData.accessibility, feature],
      });
    } else {
      setFormData({
        ...formData,
        accessibility: formData.accessibility.filter((f) => f !== feature),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle video upload logic here
    console.log("Video data:", formData);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="video-title">Video Title</Label>
        <Input
          id="video-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter video title"
          required
        />
      </div>

      <div>
        <Label htmlFor="video-description">Description</Label>
        <Textarea
          id="video-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the video content"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="video-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="lecture">Lecture</SelectItem>
              <SelectItem value="demonstration">Demonstration</SelectItem>
              <SelectItem value="sign-language">Sign Language</SelectItem>
              <SelectItem value="braille">Braille Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="video-language">Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="rw">Kinyarwanda</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Accessibility Features</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { id: "captions", label: "Closed Captions" },
            { id: "audio-description", label: "Audio Description" },
            { id: "sign-language", label: "Sign Language" },
            { id: "high-contrast", label: "High Contrast" },
          ].map((feature) => (
            <label key={feature.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.accessibility.includes(feature.id)}
                onChange={(e) =>
                  handleAccessibilityChange(feature.id, e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="video-file">Video File</Label>
          <Input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                videoFile: e.target.files?.[0] || null,
              })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="video-thumbnail">Thumbnail Image</Label>
          <Input
            id="video-thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                thumbnail: e.target.files?.[0] || null,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="video-captions">Captions File (SRT/VTT)</Label>
          <Input
            id="video-captions"
            type="file"
            accept=".srt,.vtt"
            onChange={(e) =>
              setFormData({
                ...formData,
                captions: e.target.files?.[0] || null,
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>
    </form>
  );
}

// Resource Upload Form Component
function ResourceUploadForm({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    gradeLevel: "",
    language: "",
    resourceType: "",
    accessibility: [] as string[],
    file: null as File | null,
    thumbnail: null as File | null,
  });

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        accessibility: [...formData.accessibility, feature],
      });
    } else {
      setFormData({
        ...formData,
        accessibility: formData.accessibility.filter((f) => f !== feature),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle resource upload logic here
    console.log("Resource data:", formData);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="resource-title">Resource Title</Label>
        <Input
          id="resource-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter resource title"
          required
        />
      </div>

      <div>
        <Label htmlFor="resource-description">Description</Label>
        <Textarea
          id="resource-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the resource and its educational purpose"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="resource-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worksheet">Worksheet</SelectItem>
              <SelectItem value="textbook">Textbook</SelectItem>
              <SelectItem value="audio">Audio Resource</SelectItem>
              <SelectItem value="tactile">Tactile Material</SelectItem>
              <SelectItem value="assessment">Assessment Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="resource-type">Resource Type</Label>
          <Select
            value={formData.resourceType}
            onValueChange={(value) =>
              setFormData({ ...formData, resourceType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="audio">Audio File</SelectItem>
              <SelectItem value="braille">Braille Document</SelectItem>
              <SelectItem value="tactile">Tactile Diagram</SelectItem>
              <SelectItem value="interactive">Interactive Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={formData.subject}
            onValueChange={(value) =>
              setFormData({ ...formData, subject: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="language">Language Arts</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="social-studies">Social Studies</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="grade-level">Grade Level</Label>
          <Select
            value={formData.gradeLevel}
            onValueChange={(value) =>
              setFormData({ ...formData, gradeLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pre-k">Pre-K</SelectItem>
              <SelectItem value="k-2">K-2</SelectItem>
              <SelectItem value="3-5">3-5</SelectItem>
              <SelectItem value="6-8">6-8</SelectItem>
              <SelectItem value="9-12">9-12</SelectItem>
              <SelectItem value="adult">Adult Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="resource-language">Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="rw">Kinyarwanda</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Accessibility Features</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { id: "braille", label: "Braille Compatible" },
            { id: "large-print", label: "Large Print" },
            { id: "audio", label: "Audio Version" },
            { id: "tactile", label: "Tactile Elements" },
            { id: "high-contrast", label: "High Contrast" },
            { id: "screen-reader", label: "Screen Reader Compatible" },
          ].map((feature) => (
            <label key={feature.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.accessibility.includes(feature.id)}
                onChange={(e) =>
                  handleAccessibilityChange(feature.id, e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="resource-file">Resource File</Label>
          <Input
            id="resource-file"
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files?.[0] || null })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="resource-thumbnail">Preview Image (Optional)</Label>
          <Input
            id="resource-thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                thumbnail: e.target.files?.[0] || null,
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>
    </form>
  );
}
