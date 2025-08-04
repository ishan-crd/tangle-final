# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Set up the Database Table

Run this SQL in your Supabase SQL editor:

```sql
-- Create the user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  interests TEXT[] DEFAULT '{}',
  address TEXT DEFAULT '',
  society TEXT DEFAULT '',
  flat TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you should implement proper authentication
CREATE POLICY "Allow public read access" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON user_profiles
  FOR UPDATE USING (true);
```

## 3. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon public key

## 4. Update the App Configuration

1. Open `lib/supabase.ts`
2. Replace the placeholder values:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
```

## 5. Test the Integration

1. Run the app: `npm start`
2. Go through the onboarding flow
3. Check your Supabase dashboard to see the data being saved

## 6. Environment Variables (Recommended)

For better security, use environment variables:

1. Create a `.env` file in your project root:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Update `lib/supabase.ts`:

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
```

## 7. Additional Features

### User Authentication
For production, consider implementing proper authentication:

1. Enable Auth in Supabase dashboard
2. Configure social providers (Google, Apple)
3. Update the signup flow to use Supabase Auth

### Real-time Features
Enable real-time subscriptions for live updates:

```typescript
// Subscribe to user profile changes
const subscription = supabase
  .channel('user_profiles')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### Storage for Avatars
Set up Supabase Storage for user avatars:

1. Create a storage bucket in Supabase
2. Update the avatar upload functionality
3. Configure storage policies

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows your app's domain
2. **RLS Errors**: Check that your policies allow the operations you're trying to perform
3. **Network Errors**: Verify your Supabase URL and key are correct

### Debug Tips

1. Check the browser console for error messages
2. Use Supabase dashboard to monitor database activity
3. Test queries directly in the Supabase SQL editor

## Security Notes

- The current setup allows public access for demo purposes
- For production, implement proper authentication and authorization
- Consider using Row Level Security (RLS) policies
- Never expose your service role key in client-side code 