import * as Font from "expo-font";
import { useRouter } from "expo-router";
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

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");

const genders = ["Male", "Female", "Other"];

export default function ProfileBasic() {
  const router = useRouter();
  const { user, updateUserProfile } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    return "";
  };

  const validateAge = (age: string) => {
    if (!age.trim()) {
      return "Age is required";
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      return "Age must be a number";
    }
    if (ageNum < 13 || ageNum > 100) {
      return "Age must be between 13 and 100";
    }
    return "";
  };

  const validateGender = (gender: string) => {
    if (!gender.trim()) {
      return "Please select your gender";
    }
    return "";
  };

  const handleNext = async () => {
    const nameError = validateName(name);
    const ageError = validateAge(age);
    const genderError = validateGender(gender);

    const newErrors: {[key: string]: string} = {};
    if (nameError) newErrors.name = nameError;
    if (ageError) newErrors.age = ageError;
    if (genderError) newErrors.gender = genderError;

    setErrors(newErrors);

    if (nameError || ageError || genderError) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating user profile with:', { 
        name: name.trim(), 
        age: parseInt(age),
        gender: gender
      });
      await updateUserProfile({
        name: name.trim(),
        age: parseInt(age),
        gender: gender,
      });
      console.log('Profile updated successfully');
      router.push("/onboarding/addressscreen");
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "Failed to save profile information");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Set up your</Text>
          <Text style={styles.titleAccent}>profile ✍️</Text>
          <Text style={styles.subtitle}>Let's start with the basics</Text>

          <Text style={styles.label}>What's your name or nickname?</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({...errors, name: ""});
              }
            }}
            placeholderTextColor="#999"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.label}>How old are you?</Text>
          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            placeholder="18"
            value={age}
            onChangeText={(text) => {
              // Only allow numbers
              const numericValue = text.replace(/[^0-9]/g, '');
              setAge(numericValue);
              if (errors.age) {
                setErrors({...errors, age: ""});
              }
            }}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#999"
          />
          {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={[styles.input, styles.dropdownInput, errors.gender && styles.inputError]}
            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
          >
            <Text style={gender ? styles.dropdownText : styles.placeholderText}>
              {gender || "Select your gender"}
            </Text>
          </TouchableOpacity>
          
          {showGenderDropdown && (
            <View style={styles.dropdownContainer}>
              {genders.map((genderOption, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setGender(genderOption);
                    setShowGenderDropdown(false);
                    if (errors.gender) {
                      setErrors({...errors, gender: ""});
                    }
                  }}
                >
                  <Text style={styles.dropdownItemText}>{genderOption}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.disabledButton]}
              activeOpacity={0.8}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Saving..." : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Text style={styles.footerText}>
        Don't worry, we won't ask for your blood type… yet 😜
      </Text>
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
    marginTop: 100,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 50,
  },
  titleAccent: {
    fontSize: 40,
    fontFamily: "NeuePlak-ExtendedBlack",
    color: "#1A1A1A",
    lineHeight: 42,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#666",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: "Montserrat-Thin",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 8,
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    marginBottom: 16,
  },
  dropdownInput: {
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#1A1A1A",
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#999",
  },
  dropdownContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: "Montserrat-Light",
    color: "#1A1A1A",
  },
  continueButton: {
    backgroundColor: "#D7E0FF",
    width: 100,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "#000000ff",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    color: "#1A1A1A",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
