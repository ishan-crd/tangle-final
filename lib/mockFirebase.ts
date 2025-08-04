// Mock Firebase service for Expo Go testing
// This simulates Firebase Phone Auth without requiring native modules

let mockOTP = '123456'; // Default OTP for testing

export const sendOTP = async (phoneNumber: string) => {
  console.log('Mock: Sending OTP to', phoneNumber);
  
  // Generate a random 6-digit OTP
  mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Mock: OTP sent:', mockOTP);
  
  // Return a mock confirmation object
  return {
    confirm: async (code: string) => {
      console.log('Mock: Verifying OTP:', code, 'Expected:', mockOTP);
      
      if (code === mockOTP) {
        console.log('Mock: OTP verified successfully');
        return { user: { phoneNumber } };
      } else {
        console.log('Mock: OTP verification failed. Expected:', mockOTP, 'Got:', code);
        throw new Error('Invalid OTP code');
      }
    }
  };
};

export const verifyOTP = async (confirmation: any, code: string) => {
  return await confirmation.confirm(code);
};

export const signOut = async () => {
  console.log('Mock: User signed out');
};

export const firebaseAuth = {
  signInWithPhoneNumber: sendOTP
};

// Export the current OTP for debugging
export const getCurrentOTP = () => mockOTP; 