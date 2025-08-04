# Firebase Phone Auth Setup Guide (Expo)

## 🚀 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `tangle-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 📱 **Step 2: Add Android App**

1. In Firebase Console, click the Android icon
2. Enter package name: `com.tangle.app`
3. Enter app nickname: `Tangle`
4. Click "Register app"
5. **Download `google-services.json`** and place it in the root of your project
6. **Don't worry about Android configuration** - Expo handles this automatically

## 🍎 **Step 3: Add iOS App**

1. In Firebase Console, click the iOS icon
2. Enter bundle ID: `com.tangle.app`
3. Enter app nickname: `Tangle`
4. Click "Register app"
5. **Download `GoogleService-Info.plist`** and place it in the root of your project
6. **Don't worry about iOS configuration** - Expo handles this automatically

## ⚙️ **Step 4: Enable Phone Auth**

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Phone" provider
5. Add test phone numbers if needed

## 🔧 **Step 5: Configure for Expo**

### Your app.json is already configured! ✅

The Firebase plugin is already added to your `app.json`:
```json
[
  "@react-native-firebase/app",
  {
    "android_package_name": "com.tangle.app",
    "ios_bundle_id": "com.tangle.app"
  }
]
```

## 📁 **Step 6: Place Firebase Config Files**

Place these files in your project root:
- `google-services.json` (Android config)
- `GoogleService-Info.plist` (iOS config)

## 🏗️ **Step 7: Build for Native**

Since you're using Expo, you need to build for native platforms:

### For Android:
```bash
npx expo prebuild --platform android
npx expo run:android
```

### For iOS:
```bash
npx expo prebuild --platform ios
npx expo run:ios
```

## 🧪 **Step 8: Test**

1. Build and run your app on a physical device (Firebase Phone Auth doesn't work in simulators)
2. Go through the phone number signup
3. Enter a real phone number
4. Check if OTP is received
5. Verify the OTP

## 📊 **Free Tier Limits**

- ✅ **10,000 phone verifications per month**
- ✅ **Unlimited test phone numbers**
- ✅ **No credit card required**
- ✅ **Production ready**

## 🆘 **Troubleshooting**

### Common Issues:
1. **"Invalid phone number"** - Make sure number includes country code (+1, +91, etc.)
2. **"Quota exceeded"** - You've hit the free tier limit
3. **"App not authorized"** - Check Firebase console settings
4. **"Network error"** - Check internet connection
5. **"Not working in simulator"** - Firebase Phone Auth requires physical device

### Test Numbers:
For testing, you can use these numbers:
- US: +1 650-555-1234
- India: +91 98765-43210
- UK: +44 20 7946 0958

## 🔐 **Security Notes**

- Firebase handles OTP generation securely
- No need to store OTP codes on your server
- Phone numbers are verified by Google's infrastructure
- Compliant with SMS regulations worldwide

## 📞 **Support**

If you need help:
1. Check [Firebase Documentation](https://firebase.google.com/docs/auth/phone)
2. Check [React Native Firebase Docs](https://rnfirebase.io/auth/phone-auth)
3. Firebase Console has built-in analytics and error reporting

## 🚨 **Important Notes for Expo**

- **Physical device required** - Firebase Phone Auth doesn't work in simulators
- **Development build needed** - Use `expo run:android` or `expo run:ios`
- **No EAS Build needed** - You can use local builds
- **Config files in root** - Place Firebase config files in project root 