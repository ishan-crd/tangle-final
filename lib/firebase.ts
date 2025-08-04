import auth from '@react-native-firebase/auth';

// Firebase configuration
// You'll need to add your Firebase config here
// Get this from your Firebase Console: https://console.firebase.google.com/

export const firebaseAuth = auth();

export const sendOTP = async (phoneNumber: string) => {
  try {
    const confirmation = await firebaseAuth.signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (confirmation: any, code: string) => {
  try {
    const result = await confirmation.confirm(code);
    return result;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 