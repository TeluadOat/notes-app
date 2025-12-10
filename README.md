# Notes App - Learning Project (React + Supabase)

This project is part of my **personal learning journey** to master modern web development using  
**React (Vite), Supabase, TailwindCSS, and real authentication flows**.

I built this Notes App step-by-step to understand:
- How to structure a React project  
- How authentication works  
- How CRUD operations interact with a real backend  
- How to deploy a full-stack app  

It represents **my growth**, as I will keep improving it as I learn more.

---

## What I Learned Building This Project

- Setting up React + Vite + Tailwind
- Working with Supabase authentication (login, register, logout)
- Protecting routes in React
- Using context for user state
- Performing CRUD operations (Create, Read, Update, Delete)
- Optimistic UI rendering
- Handling modals for edit, delete, and logout confirmation
- Deploying to Vercel
- Writing cleaner, reusable components

---

## Features Implemented

### Authentication
- Register
- Login
- Logout (with confirmation modal)
- Protected dashboard

### Notes CRUD
- Create notes
- Read notes
- Edit notes (edit modal)
- Delete notes (delete confirmation modal)
- User-only notes using RLS policies

### Frontend
- Responsive Tailwind UI
- Clean layout
- Reusable modals
- State management with hooks
- Context-based global auth state

---

## Features I Plan To Add As I Continue Learning
These are not done yet—but coming soon as part of my learning path:

- Profile settings page  
- Update user display name, email, photo  
- Note search & filtering  
- Dark mode  
- Realtime updates  
- Offline mode  

---

## Tech Stack

| Technology | Usage |
|-----------|--------|
| **React (Vite)** | Main framework |
| **Supabase** | Authentication + Database |
| **Tailwind CSS** | Styling |
| **React Router** | Navigation |
| **Vercel** | Deployment |

---

## How to Run Locally

### 1. Clone project
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install


create a .env file and add your Supabase
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## Database Setup (Supabase)

To run this project with Supabase, create the following table and enable RLS.

### 1. Notes Table

Create a table named `notes` with these columns:

| Column       | Type        | Default               |
|--------------|-------------|-----------------------|
| id           | uuid        | gen_random_uuid()     |
| user_id      | uuid        | auth.uid()            |
| title        | text        | —                     |
| content      | text        | —                     |
| created_at   | timestamptz | now()                 |

Make sure `id` is the Primary Key.

---

### 2. Enable Row Level Security (RLS)

After creating the table:

---

### 3. Add These RLS Policies

#### Allow users to read their own notes
#### Allow users to insert notes for themselves
#### Allow users to update their own notes
#### Allow users to delete their own notes


---

### 4. Authentication
This project uses **Supabase Email + Password Auth**.  
**Email Auth** is not enabled





