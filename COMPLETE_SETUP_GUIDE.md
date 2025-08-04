# 🏆 Tangle - Complete Social Sports App Setup Guide

## 🎯 **App Overview**

**Tangle** is a comprehensive social sports app that connects people within their societies for sports activities, tournaments, and social interactions.

### **🏗️ Architecture:**
- **Super Admin** - Manages communities, societies, and global content
- **Society Admin** - Manages their society, members, and content
- **Public Users** - Create posts, host matches, join tournaments

### **🌟 Key Features:**
- ✅ **User Management** with role-based access
- ✅ **Society-based Communities** 
- ✅ **Social Feed** with posts, stories, and interactions
- ✅ **Match & Tournament Hosting**
- ✅ **Calendar Integration** for events
- ✅ **Real-time Notifications**
- ✅ **Story Sharing** (24-hour content)
- ✅ **Content Moderation** by admins

---

## 🚀 **Step 1: Database Setup**

### **Option A: Manual Setup (Recommended)**
1. **Go to [Supabase Console](https://supabase.com/dashboard)**
2. **Select your project**
3. **Go to SQL Editor**
4. **Copy and paste** the entire content from `database-schema.sql`
5. **Execute the SQL** to create all tables

### **Option B: Automated Setup**
```bash
node scripts/setup-complete-database.js
```

---

## 🏗️ **Step 2: Database Schema Overview**

### **📊 Core Tables:**

#### **1. User Management**
- `user_profiles` - User data with roles
- `communities` - Top-level organizations
- `societies` - Sub-organizations within communities
- `society_members` - User-society relationships

#### **2. Social Features**
- `posts` - Main content feed
- `post_images` - Post media
- `post_likes` - Like interactions
- `post_comments` - Comment system
- `stories` - 24-hour content
- `story_views` - Story view tracking

#### **3. Sports & Events**
- `sports` - Available sports/activities
- `matches` - Individual matches
- `match_participants` - Match participants
- `tournaments` - Tournament events
- `tournament_teams` - Tournament teams
- `tournament_team_members` - Team members

#### **4. Calendar & Notifications**
- `calendar_events` - Scheduled events
- `notifications` - User notifications

---

## 👥 **Step 3: User Roles & Permissions**

### **🔴 Super Admin**
- **Manage all communities and societies**
- **Create/delete societies**
- **Assign society admins**
- **Global content moderation**
- **System-wide announcements**

### **🟡 Society Admin**
- **Manage their society members**
- **Moderate society content**
- **Create society announcements**
- **Manage society events**
- **Remove inappropriate posts**

### **🟢 Public User**
- **Create posts and stories**
- **Host matches and tournaments**
- **Join events and activities**
- **Interact with content**
- **View society feed**

---

## 🎯 **Step 4: App Features Implementation**

### **📱 Core Screens to Build:**

#### **Authentication & Onboarding**
- ✅ Phone number verification (Firebase)
- ✅ User profile setup
- ✅ Society selection
- ✅ Interest selection

#### **Main App Screens**
- **Home Feed** - Posts, stories, announcements
- **Matches** - Browse and join matches
- **Tournaments** - Tournament listings and registration
- **Calendar** - Event schedule
- **Profile** - User profile and settings
- **Notifications** - Push notifications

#### **Admin Screens**
- **Society Management** - Member management
- **Content Moderation** - Post approval/rejection
- **Event Management** - Create and manage events
- **Analytics** - Society statistics

---

## 🔧 **Step 5: Technical Implementation**

### **📦 Services Available:**

#### **User Services**
```typescript
import { userService } from '../lib/supabase';

// Create user
await userService.createUserProfile(userData);

// Get user by phone
const user = await userService.getUserProfileByPhone(phone);

// Update user
await userService.updateUserProfile(id, updates);
```

#### **Society Services**
```typescript
import { societyService } from '../lib/supabase';

// Get societies
const societies = await societyService.getSocieties();

// Add member to society
await societyService.addMemberToSociety(userId, societyId);
```

#### **Post Services**
```typescript
import { postService } from '../lib/supabase';

// Create post
await postService.createPost(postData);

// Get society posts
const posts = await postService.getPostsBySociety(societyId);

// Like/unlike post
await postService.likePost(postId, userId);
```

#### **Match Services**
```typescript
import { matchService } from '../lib/supabase';

// Create match
await matchService.createMatch(matchData);

// Get society matches
const matches = await matchService.getMatchesBySociety(societyId);

// Join match
await matchService.joinMatch(matchId, userId);
```

---

## 🎨 **Step 6: UI/UX Guidelines**

### **🎨 Design System:**
- **Primary Color:** #3575EC (Blue)
- **Secondary Color:** #1976D2 (Dark Blue)
- **Success:** #4CAF50 (Green)
- **Warning:** #FF9800 (Orange)
- **Error:** #F44336 (Red)

### **📱 Screen Structure:**
- **Bottom Tab Navigation** for main sections
- **Stack Navigation** for detailed screens
- **Modal Navigation** for forms and actions

### **🔔 Notifications:**
- **Push notifications** for matches, tournaments
- **In-app notifications** for social interactions
- **Email notifications** for important events

---

## 🚀 **Step 7: Deployment Checklist**

### **✅ Backend Setup**
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Row Level Security (RLS) configured
- [ ] Storage buckets created
- [ ] Real-time subscriptions enabled

### **✅ Frontend Setup**
- [ ] Firebase Phone Auth configured
- [ ] Expo development build created
- [ ] Environment variables set
- [ ] App icons and splash screens
- [ ] Push notification certificates

### **✅ Testing**
- [ ] User registration flow
- [ ] Post creation and interaction
- [ ] Match hosting and joining
- [ ] Admin functionality
- [ ] Cross-platform compatibility

---

## 📊 **Step 8: Sample Data & Testing**

### **👥 Sample Users:**
```sql
-- Super Admin
INSERT INTO user_profiles (name, phone, user_role) 
VALUES ('Super Admin', '+919876543210', 'super_admin');

-- Society Admin
INSERT INTO user_profiles (name, phone, user_role) 
VALUES ('Society Admin', '+919876543211', 'society_admin');

-- Regular User
INSERT INTO user_profiles (name, phone, user_role) 
VALUES ('John Doe', '+919876543212', 'public');
```

### **🏢 Sample Societies:**
```sql
-- Sample societies are already created in the schema
-- Palm Springs Society
-- Green Valley Society  
-- Sunset Heights Society
```

---

## 🔐 **Step 9: Security & Permissions**

### **🛡️ Row Level Security (RLS):**
- **Users can only see their society's content**
- **Admins can moderate their society's content**
- **Super admins have global access**
- **Personal data is protected**

### **🔒 Data Privacy:**
- **Phone numbers are encrypted**
- **Personal information is protected**
- **Content is society-scoped**
- **GDPR compliant data handling**

---

## 📈 **Step 10: Analytics & Monitoring**

### **📊 Key Metrics:**
- **User engagement** (posts, matches, tournaments)
- **Society activity** (member participation)
- **Content performance** (likes, comments, shares)
- **Event success** (match/tournament completion rates)

### **🔍 Monitoring:**
- **Real-time user activity**
- **System performance metrics**
- **Error tracking and reporting**
- **User feedback collection**

---

## 🎉 **Next Steps**

1. **Execute the database schema** in Supabase
2. **Test the basic user flow** with the existing code
3. **Implement the new screens** using the provided services
4. **Add admin functionality** for content moderation
5. **Deploy to production** with proper testing

### **🚀 Ready to Build!**

The complete database schema and services are now ready. You can start building the full Tangle app with all the social sports features!

---

## 📞 **Support**

- **Database Issues:** Check Supabase logs
- **App Issues:** Check Expo/React Native logs
- **Feature Requests:** Create GitHub issues
- **Documentation:** Refer to this guide

**Happy Building! 🏆** 