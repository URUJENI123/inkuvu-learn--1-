import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  videoUrl: String,
  duration: Number, // in minutes
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ["pdf", "audio", "braille", "tactile", "sign-language"],
      },
    },
  ],
  quiz: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  ],
  order: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "mathematics",
        "science",
        "language",
        "social-studies",
        "arts",
        "technology",
        "life-skills",
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    language: {
      type: String,
      enum: ["en", "fr", "rw"],
      default: "en",
    },
    thumbnailUrl: String,
    lessons: [lessonSchema],
    accessibilityFeatures: {
      audioDescriptions: { type: Boolean, default: false },
      signLanguage: { type: Boolean, default: false },
      brailleSupport: { type: Boolean, default: false },
      tactileDiagrams: { type: Boolean, default: false },
      closedCaptions: { type: Boolean, default: false },
    },
    enrolledStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
        },
        completedLessons: [Number],
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    duration: Number, // total duration in minutes
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating
courseSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Calculate total enrolled students
courseSchema.virtual("totalEnrolled").get(function () {
  return this.enrolledStudents.length;
});

courseSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Course", courseSchema);
