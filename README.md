# 🏆 Tangle - Social Sports App

A comprehensive social sports app that connects people within their societies for sports activities, tournaments, and social interactions.

## 🎯 **Features**

### **👥 User Management**
- ✅ **Role-based access** (Super Admin, Society Admin, Public User)
- ✅ **Phone number authentication** with Firebase OTP
- ✅ **User profiles** with interests, bio, and preferences
- ✅ **Society-based communities**

### **📱 Social Features**
- ✅ **Create posts** with text and images
- ✅ **Stories** (24-hour content)
- ✅ **Like and comment** on posts
- ✅ **Real-time notifications**

### **🏀 Sports & Events**
- ✅ **Host matches** and tournaments
- ✅ **Join events** and activities
- ✅ **Calendar integration** for scheduling
- ✅ **Multiple sports** support (Badminton, Basketball, Tennis, etc.)

### **🎨 Modern UI/UX**
- ✅ **Beautiful design** with consistent branding
- ✅ **Smooth animations** and transitions
- ✅ **Responsive layout** for all screen sizes
- ✅ **Dark/Light theme** support

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- Expo CLI
- Supabase account
- Firebase account (for OTP)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd tangle
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file with your Supabase and Firebase credentials
```

4. **Set up the database**
```bash
# Run the database setup script
node scripts/setup-complete-database.js
```

5. **Start the development server**
```bash
npx expo start
```

## 🏗️ **Architecture**

### **Database Schema**
- **User Profiles** - Complete user information with roles
- **Communities & Societies** - Hierarchical organization structure
- **Posts & Content** - Social feed with interactions
- **Matches & Tournaments** - Sports event management
- **Calendar Events** - Scheduling and reminders
- **Notifications** - Real-time alerts

### **User Roles**
- **🔴 Super Admin** - Global management and oversight
- **🟡 Society Admin** - Society-specific management
- **🟢 Public User** - Social interactions and sports activities

## 📱 **App Screens**

### **Authentication & Onboarding**
- Phone number verification
- User profile setup
- Society selection
- Interest selection

### **Main App**
- **Home Feed** - Posts, stories, and social interactions
- **Matches** - Browse and join sports matches
- **Tournaments** - Tournament listings and registration
- **Calendar** - Event schedule and reminders
- **Profile** - User settings and information

### **Admin Features**
- Society management
- Content moderation
- Event management
- Analytics dashboard

## 🔧 **Technical Stack**

### **Frontend**
- **React Native** - Cross-platform mobile development
- **Expo Router** - File-based navigation
- **TypeScript** - Type-safe development
- **React Context** - State management

### **Backend**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Firebase Auth** - Phone authentication
- **Real-time subscriptions** - Live updates

### **UI/UX**
- **Custom design system** - Consistent branding
- **Ionicons** - Icon library
- **Custom fonts** - Typography
- **Responsive design** - All screen sizes

## 📊 **Database Schema**

### **Core Tables**
```sql
-- User Management
user_profiles (id, name, phone, user_role, etc.)
communities (id, name, super_admin_id, etc.)
societies (id, name, community_id, society_admin_id, etc.)
society_members (user_id, society_id, role, etc.)

-- Social Features
posts (id, user_id, society_id, content, etc.)
post_likes (post_id, user_id)
post_comments (id, post_id, user_id, content, etc.)
stories (id, user_id, society_id, content, etc.)

-- Sports & Events
sports (id, name, description, icon)
matches (id, host_id, society_id, sport_id, etc.)
tournaments (id, host_id, society_id, sport_id, etc.)
calendar_events (id, title, event_type, start_time, etc.)

-- Notifications
notifications (id, user_id, title, message, etc.)
```

## 🎨 **Design System**

### **Colors**
- **Primary**: #3575EC (Blue)
- **Secondary**: #1976D2 (Dark Blue)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Error**: #F44336 (Red)

### **Typography**
- **Headings**: Neue-Plak-Extended-Bold
- **Body**: Montserrat-Regular
- **Buttons**: Montserrat-Bold

## 🔐 **Security**

### **Authentication**
- Phone number verification with Firebase
- Secure token management
- Role-based access control

### **Data Protection**
- Row Level Security (RLS) in Supabase
- Encrypted data transmission
- GDPR compliant data handling

## 📈 **Features Roadmap**

### **Phase 1** ✅ (Complete)
- Basic user authentication
- Profile management
- Social feed
- Match hosting

### **Phase 2** 🚧 (In Progress)
- Tournament management
- Advanced notifications
- Admin dashboard
- Analytics

### **Phase 3** 📋 (Planned)
- Video calls
- Live streaming
- Advanced analytics
- Mobile app stores

## 🛠️ **Development**

### **Running the App**
```bash
# Development
npx expo start

# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android
```

### **Database Management**
```bash
# Setup database
node scripts/setup-complete-database.js

# Fix database issues
node scripts/fix-database.js
```

### **Testing**
```bash
# Run tests
npm test

# E2E testing
npm run test:e2e
```

## 📱 **Screenshots**

### **Home Feed**
- Social posts with interactions
- Stories section
- Quick action buttons

### **Matches**
- Browse available matches
- Join matches
- Host new matches

### **Profile**
- User information
- Settings
- Logout functionality

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

- **Documentation**: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Issues**: GitHub Issues
- **Email**: support@tangle.app

## 🎉 **Acknowledgments**

- **Expo** for the amazing development platform
- **Supabase** for the backend services
- **Firebase** for authentication
- **React Native** community for the ecosystem

---

**Built with ❤️ for the sports community**
