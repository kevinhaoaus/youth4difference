# VolunteerVibe 🌟

A social volunteering platform that connects students with local organizations for meaningful community engagement. Built for [Hack48 Sydney](https://hack48.sydney/).

## ✨ Features

### For Students
- 🔐 **Easy Signup** - Quick registration with university info
- 📍 **Local Events** - Discover volunteering opportunities nearby
- 👥 **Social Experience** - See events your friends are joining
- 📱 **Mobile First** - Optimized for mobile devices
- 🚀 **One-Click Join** - Simple event registration

### For Organizations
- 🏢 **Organization Dashboard** - Manage events and volunteers
- 📝 **Event Creation** - Create engaging volunteer opportunities
- 📊 **Registration Tracking** - Monitor volunteer signups
- 🏷️ **Social Tags** - Make events discoverable and fun

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/Hack48-Sydney/volunteervibe.git
cd volunteervibe
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the database schema:

```sql
-- Create custom types
CREATE TYPE user_type AS ENUM ('student', 'organization');

-- Users table (both students and organizations)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  university TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization profiles  
CREATE TABLE organization_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  contact_person_name TEXT,
  contact_phone TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location_address TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  max_volunteers INTEGER DEFAULT 10,
  social_tags JSONB DEFAULT '[]',
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Friend connections
CREATE TABLE user_friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friendships ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for student_profiles
CREATE POLICY "Students can CRUD own profile" ON student_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read student profiles" ON student_profiles FOR SELECT TO authenticated USING (true);

-- Policies for organization_profiles  
CREATE POLICY "Orgs can CRUD own profile" ON organization_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read org profiles" ON organization_profiles FOR SELECT TO authenticated USING (true);

-- Policies for events
CREATE POLICY "Orgs can CRUD own events" ON events FOR ALL USING (auth.uid() = org_id);
CREATE POLICY "Anyone can read published events" ON events FOR SELECT TO authenticated USING (status = 'published');

-- Policies for event_registrations
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can see all registrations" ON event_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can cancel own registrations" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, user_type)
  VALUES (NEW.id, NEW.email, 'student'); -- Default to student, can be changed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Environment Variables
Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## 🎯 User Journey

### Students
1. **Sign up** with email and basic info
2. **Browse events** on the dashboard
3. **Join events** with one click
4. **View registrations** and manage attendance

### Organizations
1. **Register** your organization
2. **Create events** with details and social tags
3. **Track registrations** and manage capacity
4. **Engage volunteers** through the platform

## 🏗️ Project Structure

```
volunteervibe/
├── app/                    # Next.js 14 App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Student dashboard
│   ├── org/               # Organization pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Auth forms
│   ├── dashboard/        # Student components
│   ├── org/              # Organization components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities
│   ├── supabase/         # Database clients
│   └── types/            # TypeScript definitions
└── tasks/                 # Implementation tracking
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛣️ Roadmap

- [ ] Friend connections and social features
- [ ] University email verification
- [ ] Advanced location filtering with maps
- [ ] Push notifications
- [ ] Event categories and search
- [ ] Volunteer hour tracking
- [ ] Organization verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👏 Acknowledgments

- Built for Hack48 Sydney
- Powered by Next.js and Supabase
- UI components from Radix UI
- Icons from Lucide React

---

Made with ❤️ for the volunteering community in Sydney 🇦🇺