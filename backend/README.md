# Inkuvu Learn Backend

Backend API for Inkuvu Learn - Inclusive Education Platform for Rwanda

## Technology Stack

- **Database**: PostgreSQL with Prisma ORM
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT tokens with bcryptjs
- **File Upload**: Cloudinary integration
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, Rate limiting

## Database Setup

### Prerequisites
- PostgreSQL installed and running
- Node.js 16+ installed

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your database credentials
\`\`\`

3. Generate Prisma client:
\`\`\`bash
npm run db:generate
\`\`\`

4. Run database migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

5. Seed the database (optional):
\`\`\`bash
npm run db:seed
\`\`\`

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and run migrations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (teacher/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `PUT /api/courses/:id/progress` - Update progress

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Toggle user status

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Upload resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### File Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video
- `POST /api/upload/document` - Upload document

## Database Schema

The database uses PostgreSQL with the following main entities:

- **Users**: Student, teacher, parent, admin accounts with accessibility preferences
- **Courses**: Educational courses with lessons, quizzes, and accessibility features
- **Resources**: Digital library resources (braille, audio, video, tactile materials)
- **Enrollments**: Course enrollment and progress tracking
- **Achievements**: User achievement system
- **Ratings**: Course and resource rating system

## Accessibility Features

The platform includes comprehensive accessibility support:

- **Visual**: Screen reader compatibility, high contrast, large text
- **Audio**: Audio descriptions, closed captions
- **Motor**: Sign language support, tactile diagrams
- **Cognitive**: Braille support, simplified interfaces
- **Multi-language**: English, French, Kinyarwanda support

## Security

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS protection
- Input validation with Joi
- SQL injection prevention with Prisma

## Development

### Database Changes

When making schema changes:

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Generate client: `npm run db:generate`

### Testing

Use the provided Postman collection in `/postman` directory for API testing.

## Deployment

1. Set production environment variables
2. Run migrations: `npm run db:migrate`
3. Start server: `npm start`

## Support

For technical support or questions about the inclusive education features, please contact the development team.
