import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      enum: [
        "braille",
        "audio",
        "video",
        "tactile",
        "sign-language",
        "text",
        "interactive",
      ],
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
      enum: ["primary", "secondary", "tertiary"],
    },
    language: {
      type: String,
      enum: ["en", "fr", "rw"],
      default: "en",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    fileSize: Number, // in bytes
    duration: Number, // for audio/video resources in minutes
    downloadCount: {
      type: Number,
      default: 0,
    },
    accessibilityFeatures: {
      screenReaderCompatible: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      audioDescriptions: { type: Boolean, default: false },
      signLanguage: { type: Boolean, default: false },
      brailleReady: { type: Boolean, default: false },
      tactileElements: { type: Boolean, default: false },
    },
    tags: [String],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
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
  },
  {
    timestamps: true,
  }
);

// Calculate average rating
resourceSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

resourceSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Resource", resourceSchema);
