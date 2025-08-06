# Tangle Backend Setup Guide

## 🎯 Overview

This backend is built on Supabase and provides a complete social sports platform with hierarchical data structure:

**Country → States → Societies → Users**

## 📊 Database Schema

### Hierarchical Structure
```
India
├── Delhi
│   ├── New Greens
│   └── Plak Rounds
├── Karnataka (Bangalore)
│   ├── Bangalore Heights
│   ├── Tech Park Residency
│   └── Garden City Society
└── Uttar Pradesh
    ├── Eldeco Utopia
    ├── Ajnara
    ├── Shipra Neo (Ghaziabad)
    └── ATS Indira (Ghaziabad)
```

### Core Tables

1. **countries** - Top level (India)
2. **states** - Second level (Delhi, Karnataka, Uttar Pradesh)
3. **societies** - Third level (specific societies)
4. **user_profiles** - User data with society association
5. **posts** - Social feed posts (society-scoped)
6. **matches** - Sports matches and events
7. **match_participants** - Users participating in matches
8. **stories** - 24-hour stories
9. **notifications** - User notifications
10. **comments** - Post comments
11. **likes** - Post likes

## 🚀 Quick Setup

### Option 1: Run SQL Script Directly

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/setup-database.sql`
4. Execute the script

### Option 2: Use Node.js Script

```bash
# Install dependencies
npm install @supabase/supabase-js

# Run the setup script
node scripts/run-setup.js
```

### Option 3: Manual Setup

```bash
# Run the manual setup
node -e "require('./scripts/run-setup.js').runManualSetup()"
```

## 🔧 Features Implemented

### 1. User Management
- ✅ User registration and profile creation
- ✅ Society-based user organization
- ✅ User interests and bio
- ✅ Age and gender validation

### 2. Social Feed
- ✅ Society-scoped posts (users only see posts from their society)
- ✅ Post types: general, match, tournament, announcement
- ✅ Like and comment functionality
- ✅ Post timestamps and engagement metrics

### 3. Sports Matches
- ✅ Match creation and hosting
- ✅ Participant management
- ✅ Match scheduling and venue details
- ✅ Match types: casual, competitive

### 4. Stories
- ✅ 24-hour expiring stories
- ✅ Society-scoped story visibility
- ✅ Media support for stories

### 5. Notifications
- ✅ User-specific notifications
- ✅ Different notification types
- ✅ Read/unread status

### 6. Security & Privacy
- ✅ Row Level Security (RLS) policies
- ✅ Society-based data isolation
- ✅ User can only access their society's data
- ✅ Proper authentication checks

## 📱 Frontend Integration

The backend is designed to work seamlessly with the existing React Native frontend:

### User Onboarding Flow
1. **Sign Up** → Creates user profile
2. **Profile Basic** → Name, age, gender
3. **Address Screen** → State and society selection
4. **Interests** → User interests selection
5. **About You** → Bio and personal info
6. **Notifications** → Permission setup

### Main App Features
- **Home Feed** → Society-scoped posts
- **Add Post** → Create posts and matches
- **Profile** → User profile and posts
- **Search** → Find users in society
- **Hub** → Society-specific features

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only view data from their society
- Users can only modify their own data
- Society isolation prevents cross-society access

### Data Validation
- Age validation (13-100 years)
- Phone number uniqueness
- Required field validation
- Post type validation

## 📊 Sample Data

The setup includes sample data for testing:

### Users (16 total)
- **Delhi**: Rahul Sharma, Priya Singh, Amit Kumar, Neha Gupta
- **Bangalore**: Arjun Reddy, Ananya Rao, Vikram Patel, Sneha Iyer
- **Uttar Pradesh**: Rajesh Verma, Pooja Mishra, Suresh Tyagi, Yash Bhatt, Aditya Arora, Thripati, Rawat, Navya Talwar

### Sample Posts
- Each society has sample posts from their users
- Posts are society-scoped (only visible to society members)

### Sample Matches
- Basketball match at New Greens
- Football tournament at Plak Rounds
- Cricket match at Eldeco Utopia
- Tennis doubles at Ajnara

## 🛠️ API Services

### User Services
```javascript
// Create user profile
await userService.createUserProfile(profileData);

// Update user profile
await userService.updateUserProfile(userId, updates);

// Get users by society
await userService.getUsersBySociety(societyName);
```

### Post Services
```javascript
// Create post
await postService.createPost(postData);

// Get posts by society
await postService.getPostsBySocietyName(societyName);

// Like/unlike post
await postService.likePost(postId, userId);
await postService.unlikePost(postId, userId);
```

### Match Services
```javascript
// Create match
await matchService.createMatch(matchData);

// Join/leave match
await matchService.joinMatch(matchId, userId);
await matchService.leaveMatch(matchId, userId);
```

### Society Services
```javascript
// Get societies by state
await societyService.getSocietiesByState(stateId);

// Search societies
await societyService.searchSocieties(query, stateId);
```

## 🔍 Database Queries

### Get Posts for User's Society
```sql
SELECT p.*, up.name, up.avatar
FROM posts p
JOIN user_profiles up ON p.user_id = up.id
WHERE p.society_id = (
  SELECT society_id FROM user_profiles WHERE id = :userId
)
ORDER BY p.created_at DESC;
```

### Get Users in Society
```sql
SELECT *
FROM user_profiles
WHERE society = :societyName
ORDER BY name;
```

### Get Matches in Society
```sql
SELECT m.*, up.name as host_name
FROM matches m
JOIN user_profiles up ON m.host_id = up.id
WHERE m.society_id = :societyId
ORDER BY m.scheduled_date;
```

## 🚨 Important Notes

1. **Society Isolation**: Users can only see content from their own society
2. **Data Privacy**: RLS policies ensure data security
3. **Scalability**: Indexes are created for optimal performance
4. **Backup**: The schema includes proper foreign key constraints
5. **Audit Trail**: All tables have created_at and updated_at timestamps

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure user is authenticated
2. **Society Not Found**: Check if society exists in database
3. **Permission Denied**: Verify user belongs to correct society

### Debug Queries

```sql
-- Check user's society
SELECT society, society_id FROM user_profiles WHERE id = :userId;

-- Check society posts
SELECT COUNT(*) FROM posts WHERE society_id = :societyId;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

## 📈 Performance Optimizations

- Indexes on frequently queried columns
- Society-based partitioning for large datasets
- Efficient foreign key relationships
- Optimized queries for feed generation

## 🔄 Future Enhancements

- Tournament management system
- Advanced match scheduling
- Real-time notifications
- Media upload support
- Analytics and reporting
- Admin dashboard

---

**🎉 Your Tangle backend is now ready! Users can sign up, join societies, create posts, host matches, and interact within their society boundaries.** 