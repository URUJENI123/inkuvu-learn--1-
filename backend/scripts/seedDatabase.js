import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seed...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@inkuvu.rw" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@inkuvu.rw",
      password: hashedPassword,
      role: "ADMIN",
      preferredLanguage: "EN",
      bio: "System Administrator for Inkuvu Learn Platform",
      location: "Kigali, Rwanda",
      isActive: true,
    },
  });

  // Create sample teacher
  const teacherPassword = await bcrypt.hash("teacher123", 12);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@inkuvu.rw" },
    update: {},
    create: {
      firstName: "Marie",
      lastName: "Uwimana",
      email: "teacher@inkuvu.rw",
      password: teacherPassword,
      role: "TEACHER",
      preferredLanguage: "RW",
      bio: "Experienced teacher specializing in inclusive education",
      location: "Kigali, Rwanda",
      signLanguage: true,
      brailleSupport: true,
      isActive: true,
    },
  });

  // Create sample student
  const studentPassword = await bcrypt.hash("student123", 12);

  const student = await prisma.user.upsert({
    where: { email: "student@inkuvu.rw" },
    update: {},
    create: {
      firstName: "Jean",
      lastName: "Mukamana",
      email: "student@inkuvu.rw",
      password: studentPassword,
      role: "STUDENT",
      preferredLanguage: "FR",
      bio: "Enthusiastic learner interested in mathematics and science",
      location: "Butare, Rwanda",
      screenReader: true,
      audioDescriptions: true,
      isActive: true,
    },
  });

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: "Introduction to Mathematics",
      description:
        "Basic mathematics course designed for inclusive learning with accessibility features",
      category: "MATHEMATICS",
      level: "BEGINNER",
      language: "EN",
      instructorId: teacher.id,
      createdById: teacher.id,
      audioDescriptions: true,
      signLanguage: true,
      brailleSupport: true,
      closedCaptions: true,
      isPublished: true,
      tags: ["mathematics", "basic", "inclusive", "accessible"],
      lessons: {
        create: [
          {
            title: "Numbers and Counting",
            description: "Learn basic number concepts and counting techniques",
            order: 1,
            duration: 30,
            resources: {
              create: [
                {
                  title: "Counting Guide",
                  url: "/resources/counting-guide.pdf",
                  type: "PDF",
                },
                {
                  title: "Audio Numbers",
                  url: "/resources/numbers-audio.mp3",
                  type: "AUDIO",
                },
              ],
            },
          },
          {
            title: "Basic Addition",
            description:
              "Introduction to addition with visual and tactile aids",
            order: 2,
            duration: 45,
            resources: {
              create: [
                {
                  title: "Addition Worksheet",
                  url: "/resources/addition-worksheet.pdf",
                  type: "PDF",
                },
                {
                  title: "Tactile Addition Board",
                  url: "/resources/tactile-addition.pdf",
                  type: "TACTILE",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create sample resource
  const resource = await prisma.resource.create({
    data: {
      title: "Braille Mathematics Guide",
      description:
        "Comprehensive guide for learning mathematics using braille notation",
      type: "BRAILLE",
      category: "MATHEMATICS",
      level: "PRIMARY",
      language: "EN",
      fileUrl: "/resources/braille-math-guide.brf",
      uploadedById: teacher.id,
      screenReaderCompatible: true,
      brailleReady: true,
      isPublished: true,
      tags: ["braille", "mathematics", "guide", "primary"],
    },
  });

  // Enroll student in course
  await prisma.courseEnrollment.create({
    data: {
      studentId: student.id,
      courseId: course.id,
      progress: 0.5,
      completedLessons: [1],
    },
  });

  // Add achievement to student
  await prisma.achievement.create({
    data: {
      title: "First Course Enrollment",
      description: "Successfully enrolled in your first course",
      icon: "🎓",
      userId: student.id,
    },
  });

  console.log("Database seeded successfully!");
  console.log(` Admin User: admin@inkuvu.rw (password: admin123)`);
  console.log(`Teacher: teacher@inkuvu.rw (password: teacher123)`);
  console.log(` Student: student@inkuvu.rw (password: student123)`);
}

main()
  .catch((e) => {
    console.error(" Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
