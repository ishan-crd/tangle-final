import * as Font from "expo-font";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "../../contexts/UserContext";
import { userService } from "../../lib/supabase";

SplashScreen.preventAutoHideAsync();
const { width, height } = Dimensions.get("window");

const countries = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
];

export default function NumberSignup() {
  const router = useRouter();
  const { setUser } = useUser();
  const searchParams = useLocalSearchParams();
  const isLoginMode = searchParams.mode === 'login';
  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to India
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "NeuePlak-ExtendedBold": require("../../assets/fonts/Neue-Plak-Extended-Bold.ttf"),
          "NeuePlak-ExtendedBlack": require("../../assets/fonts/Neue-Plak-Extended-Black.ttf"),
          "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        });
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    }

    loadFonts();
  }, []);

  const handleNext = async () => {
    setError("");
    
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (phoneNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    
    if (!/^\d+$/.test(phoneNumber)) {
      setError("Phone number must contain only numbers");
      return;
    }

    setIsLoading(true);
    try {
      const fullPhoneNumber = selectedCountry.code + phoneNumber;
      console.log('Checking for existing user with phone:', fullPhoneNumber);
      
      if (isLoginMode) {
        // Login mode - check if user exists
        let existingUser = null;
        try {
          existingUser = await userService.getUserProfileByPhone(fullPhoneNumber);
          console.log('Found existing user:', existingUser);
        } catch (error) {
          console.log('No existing user found');
        }
        
        if (existingUser) {
          // Use existing user
          setUser(existingUser);
          console.log('Using existing user profile');
          // Skip onboarding for login users - go straight to main app
          router.push("/main");
        } else {
          Alert.alert("Error", "No account found with this phone number. Please sign up first.");
        }
      } else {
        // Signup mode - check if user exists
        let existingUser = null;
        try {
          existingUser = await userService.getUserProfileByPhone(fullPhoneNumber);
          console.log('Found existing user:', existingUser);
        } catch (error) {
          console.log('No existing user found, will create new one');
        }
        
        let userProfile;
        
        if (existingUser) {
          Alert.alert("Error", "An account with this phone number already exists. Please login instead.");
          return;
        } else {
          // Create a new user with the phone number
          const mockUser = {
            name: "Number User",
            age: 0,
            phone: fullPhoneNumber,
            interests: [],
            address: "",
            society: "",
            flat: "",
            avatar: "",
            bio: "",
            gender: ""
          };
          
          console.log('Creating new user profile with data:', mockUser);
          userProfile = await userService.createUserProfile(mockUser);
          console.log('User profile created successfully:', userProfile);
        }
        
        // Set the user in context immediately
        setUser(userProfile);
        
        // Save phone number and proceed
        router.push("/onboarding/otpverify");
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      console.error('Error details:', error?.message, error?.code);
      Alert.alert("Error", "Failed to create user profile: " + (error?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main content */}
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Can we get your</Text>
          <Text style={styles.welcomeText}>number, please?</Text>
          <Text style={styles.descriptionText}>
            We only use phone numbers to make sure everyone on tangle is real.
          </Text>

          {/* Input Field */}
          <View style={styles.phoneInputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <TouchableOpacity
                style={styles.countryInput}
                onPress={() => setShowCountryDropdown(!showCountryDropdown)}
              >
                <Text style={styles.countryText}>
                  {selectedCountry.flag} {selectedCountry.code}
                </Text>
              </TouchableOpacity>

              {showCountryDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
                    {countries.map((country, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {country.flag} {country.name} ({country.code})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <TextInput
                style={[styles.phoneInput, error && styles.inputError]}
                placeholder="Enter 10 digit number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError("");
                }}
              />
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Continue Button */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.continueButton, phoneNumber.length === 10 && styles.continueButtonActive, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Loading..." : (isLoginMode ? "Login" : "Next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 37,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#666666",
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 48,
    maxWidth: 300,
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "column",
    position: "relative",
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
    marginBottom: 6,
    marginLeft: 7,
  },
  countryInput: {
    width: 80,
    height: 44,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countryText: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdown: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
  },
  phoneInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 70,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    marginLeft: 7,
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#D7E0FF",
    width: 100,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  continueButtonActive: {
    opacity: 1,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000ff",
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: "#D7E0FF",
  },
});
