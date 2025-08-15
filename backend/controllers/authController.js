import jwt from "jsonwebtoken";
import User from "../model/User.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, preferredLanguage } =
        req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with this email",
        });
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        preferredLanguage,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Return user data
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          fullName: user.fullName,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Server error during registration",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(400).json({
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error during login",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get current user
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .populate("coursesEnrolled", "title thumbnailUrl")
        .populate("coursesCompleted.courseId", "title thumbnailUrl");

      res.json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          location: user.location,
          preferredLanguage: user.preferredLanguage,
          accessibilityPreferences: user.accessibilityPreferences,
          coursesEnrolled: user.coursesEnrolled,
          coursesCompleted: user.coursesCompleted,
          achievements: user.achievements,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        message: "Server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const allowedUpdates = [
        "firstName",
        "lastName",
        "bio",
        "location",
        "preferredLanguage",
        "accessibilityPreferences",
      ];

      const updates = {};
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          location: user.location,
          preferredLanguage: user.preferredLanguage,
          accessibilityPreferences: user.accessibilityPreferences,
          fullName: user.fullName,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Server error during profile update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Change user password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id);

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        message: "Server error during password change",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Refresh JWT token
  refreshToken: async (req, res) => {
    try {
      // Generate new token
      const token = generateToken(req.user.id);

      res.json({
        message: "Token refreshed successfully",
        token,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        message: "Server error during token refresh",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      res.json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        message: "Server error during logout",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },
};

export default authController;
