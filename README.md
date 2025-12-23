# CampusFind – Sahyadri College

**CampusFind** is the official digital Lost & Found portal for **Sahyadri College of Engineering & Management**. It serves as a centralized platform where students and staff can report lost items, check for found items, and reconnect with their belongings easily.

## 🚩 Problem Statement

In a college campus, lost and found items are currently handled through informal channels such as word of mouth, or whatsapp groups. This leads to poor visibility, delayed recovery, lack of verification, and lost items remaining unclaimed. There is no centralized, reliable, and secure system to report, track, and manage lost and found items, resulting in inefficiency and inconvenience for students and staff.

The absence of an official platform also makes it difficult to ensure authenticity, ownership, and accountability during item recovery.

## 🚀 Key Features

-   **Campus-Exclusive Access**: Sign-up is strictly restricted to valid `@sahyadri.edu.in` email addresses, ensuring a secure and trusted community.
-   **Report Lost & Found**: Easily post details about items you've lost or found, including descriptions, locations, and photos.
-   **Smart Search & Filters**: Browse listings by category (Electronics, ID Cards, Books, etc.) or status (Lost vs. Found).
-   **User Dashboard**: Manage your own reports. Mark items as "Returned" or delete them once the issue is resolved.
-   **Contact Options**: Securely view contact details (Email) of the person who reported the item.

## 🛠️ Tech Stack

This project is built with a modern web stack for performance and scalability:

-   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router) – for a fast, SEO-friendly React framework.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) – for a clean, responsive, and custom design matching the college theme.
-   **Backend & Database**: [Supabase](https://supabase.com/) – provides Authentication, PostgreSQL Database, and File Storage.
-   **Icons**: [Lucide React](https://lucide.dev/) – for beautiful, consistent iconography.

## 🏃‍♂️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   A **Supabase** project (for backend credentials)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/campus-find.git
cd campus-find
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running!

## 📂 Project Structure

Here is a quick overview of the important files and folders:

-   `app/`: Main application code (Next.js App Router).
    -   `page.tsx`: The landing page.
    -   `dashboard/`: User dashboard page.
    -   `items/`: Pages for creating and viewing items.
    -   `browse/`: Search and filter listings page.
    -   `auth/`: Login and Signup pages.
    -   `actions/`: Server Actions for backend logic (creating items, Auth).
-   `components/`: Reusable UI components (Navbar, Footer, ItemCard, etc.).
-   `utils/supabase/`: Helper functions to connect to Supabase.
-   `schema.sql`: The database schema and security policies.

## 🔒 Security & Privacy

-   **Row Level Security (RLS)**: Policies are enforced at the database level.
    -   Anyone can view listings.
    -   Only authenticated users can post items.
    -   Only the creator of an item can update or delete it.
-   **Email Verification**: Users must verify their Sahyadri email before accessing the platform.

---

**Built with ❤️ for Sahyadri.**
