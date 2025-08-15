import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "parent", "admin"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "fr", "rw"],
      default: "en",
    },
    accessibilityPreferences: {
      screenReader: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      largeText: { type: Boolean, default: false },
      audioDescriptions: { type: Boolean, default: false },
      signLanguage: { type: Boolean, default: false },
      brailleSupport: { type: Boolean, default: false },
    },
    coursesEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    coursesCompleted: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        score: Number,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        icon: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
