# PeraPixel Production

Real estate video editing agency landing page and administrative dashboard.

## Project Overview

PeraPixel is a high-performance web application consisting of a public landing page for a video editing agency and a secure admin panel for content and user management.

## Technical Stack

- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS 4, Lucide React
- Database: MongoDB
- Authentication: JWT (jose/bcrypt)
- UI Components: Radix UI, Shadcn UI
- Animations: Framer Motion

## Core Features

### Landing Page

- Responsive sections: Hero, Portfolio, Services, Testimonials, and Contact.
- Performance optimization: Server-side fetching for portfolio videos.
- Visuals: Dark mode design with motion animations.

### Admin Dashboard (Protected)

- Video Management: Full CRUD operations for portfolio items.
- Video Organization: Drag-and-drop reordering for the frontend showcase.
- User Management: Add and delete administrative users.
- Search & Filter: Tab-based filtering for videos list.

## Project Structure

- /app: Routes for landing page, admin panel, and API endpoints.
- /components: Reusable UI elements and dashboard modules.
- /sections: Main sections of the landing page.
- /lib: MongoDB connection, authentication logic, and utility functions.
- /public: Static assets and images.
