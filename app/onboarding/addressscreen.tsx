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

// Hardcoded states since the table doesn't exist yet
const states = [
  { id: "1", name: "Delhi", code: "DL" },
  { id: "2", name: "Mumbai", code: "MH" },
  { id: "3", name: "Bangalore", code: "KA" },
  { id: "4", name: "Noida", code: "UP" },
  { id: "5", name: "Gurgaon", code: "HR" },
  { id: "6", name: "Pune", code: "MH" },
  { id: "7", name: "Hyderabad", code: "TS" },
  { id: "8", name: "Chennai", code: "TN" },
  { id: "9", name: "Kolkata", code: "WB" },
  { id: "10", name: "Ahmedabad", code: "GJ" },
];

// Sample societies for each state
const societiesByState = {
  "Noida": ["Eldeco Utopia", "Palm Greens", "Supertech Ecovillage", "Jaypee Greens"],
  "Gurgaon": ["DLF Phase 1", "Suncity Township", "Palm Springs"],
  "Delhi": ["Vasant Vihar", "Greater Kailash", "Saket"],
  "Mumbai": ["Bandra West", "Juhu", "Powai"],
  "Bangalore": ["Koramangala", "Indiranagar", "Whitefield"],
  "Pune": ["Koregaon Park", "Baner", "Kharadi"],
  "Hyderabad": ["Banjara Hills", "Jubilee Hills", "Gachibowli"],
  "Chennai": ["T Nagar", "Adyar", "Anna Nagar"],
  "Kolkata": ["Park Street", "Salt Lake", "New Town"],
  "Ahmedabad": ["Satellite", "Vastrapur", "Navrangpura"],
};

export default function AddressScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [society, setSociety] = useState(user?.society || "");
  const [flat, setFlat] = useState(user?.flat || "");
  const [selectedState, setSelectedState] = useState<any>(null);
  const [societySearch, setSocietySearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);
  const [filteredSocieties, setFilteredSocieties] = useState<string[]>([]);
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

  useEffect(() => {
    if (societySearch.trim()) {
      filterSocieties();
    } else if (selectedState) {
      setFilteredSocieties(societiesByState[selectedState.name] || []);
    }
  }, [societySearch, selectedState]);

  const filterSocieties = () => {
    if (!selectedState) return;
    
    const stateSocieties = societiesByState[selectedState.name] || [];
    const filtered = stateSocieties.filter(society =>
      society.toLowerCase().includes(societySearch.toLowerCase())
    );
    setFilteredSocieties(filtered);
  };

  const handleStateSelect = (state: any) => {
    setSelectedState(state);
    setSocietySearch("");
    setSociety("");
    setShowStateDropdown(false);
    setFilteredSocieties(societiesByState[state.name] || []);
  };

  const handleSocietySelect = (societyName: string) => {
    setSociety(societyName);
    setSocietySearch(societyName);
    setShowSocietyDropdown(false);
  };

  const handleCreateNewSociety = () => {
    if (!selectedState || !societySearch.trim()) {
      Alert.alert("Error", "Please select a state and enter a society name");
      return;
    }

    // Add the new society to the list
    if (!societiesByState[selectedState.name]) {
      societiesByState[selectedState.name] = [];
    }
    societiesByState[selectedState.name].push(societySearch.trim());
    
    setSociety(societySearch.trim());
    setShowSocietyDropdown(false);
    Alert.alert("Success", `Created new society "${societySearch.trim()}" in ${selectedState.name}`);
  };

  const validateSociety = (society: string) => {
    if (!society.trim()) {
      return "Please enter your society name";
    }
    return "";
  };

  const validateFlat = (flat: string) => {
    if (!flat.trim()) {
      return "Please enter your flat number";
    }
    return "";
  };

  const handleNext = async () => {
    const societyError = validateSociety(society);
    const flatError = validateFlat(flat);

    const newErrors: {[key: string]: string} = {};
    if (!selectedState) newErrors.state = "Please select a region";
    if (societyError) newErrors.society = societyError;
    if (flatError) newErrors.flat = flatError;

    setErrors(newErrors);

    if (!selectedState || societyError || flatError) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating address with:', { 
        society: society.trim(), 
        flat: flat.trim(),
        state_name: selectedState?.name,
        society_name: society.trim()
      });
      await updateUserProfile({
        society: society.trim(),
        flat: flat.trim(),
        state_name: selectedState?.name,
        society_name: society.trim()
      });
      console.log('Address updated successfully');
      router.push("/onboarding/interestscreen");
    } catch (error) {
      console.error('Error updating address:', error);
      // Don't show alert, just log the error and continue
      console.log('Continuing despite error...');
      router.push("/onboarding/interestscreen");
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
          <Text style={styles.title}>Where do you</Text>
          <Text style={styles.titleAccent}>live 🏢</Text>
          <Text style={styles.subtitle}>
            We'll only show up if there's free food involved 🔊
          </Text>

          <Text style={styles.label}>Region</Text>
          
          {/* State Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowStateDropdown(!showStateDropdown)}
            >
              <Text style={styles.dropdownText}>
                {selectedState ? selectedState.name : "Select State"}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            {showStateDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll}>
                  {states.map((state) => (
                    <TouchableOpacity
                      key={state.id}
                      style={styles.dropdownItem}
                      onPress={() => handleStateSelect(state)}
                    >
                      <Text style={styles.dropdownItemText}>{state.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}

          <Text style={styles.label}>Your society's name?</Text>
          
          {/* Society Input with Dropdown */}
          <View style={styles.societyContainer}>
            <TextInput
              style={[styles.input, errors.society && styles.inputError]}
              placeholder="Enter your society name"
              placeholderTextColor="#999"
              value={societySearch}
              onChangeText={(text) => {
                setSocietySearch(text);
                setSociety(text);
                if (errors.society) {
                  setErrors({...errors, society: ""});
                }
                setShowSocietyDropdown(true);
              }}
              onFocus={() => {
                if (selectedState) {
                  setShowSocietyDropdown(true);
                }
              }}
            />
            
            {showSocietyDropdown && selectedState && (
              <View style={styles.societyDropdownList}>
                <ScrollView style={styles.dropdownScroll}>
                  {filteredSocieties.map((societyName, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => handleSocietySelect(societyName)}
                    >
                      <Text style={styles.dropdownItemText}>{societyName}</Text>
                    </TouchableOpacity>
                  ))}
                  {societySearch.trim() && !filteredSocieties.some(s => s.toLowerCase() === societySearch.toLowerCase()) && (
                    <TouchableOpacity
                      style={[styles.dropdownItem, styles.createNewItem]}
                      onPress={handleCreateNewSociety}
                    >
                      <Text style={styles.createNewText}>Create "{societySearch}"</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
          {errors.society ? <Text style={styles.errorText}>{errors.society}</Text> : null}

          <Text style={styles.label}>Flat Number</Text>
          <TextInput
            style={[styles.input, errors.flat && styles.inputError]}
            placeholder="Enter your flat number"
            placeholderTextColor="#999"
            value={flat}
            onChangeText={(text) => {
              setFlat(text);
              if (errors.flat) {
                setErrors({...errors, flat: ""});
              }
            }}
          />
          {errors.flat ? <Text style={styles.errorText}>{errors.flat}</Text> : null}

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
    fontSize: 13,
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
    fontSize: 16,
    color: "#333",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    marginBottom: 8,
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Montserrat-Regular",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  dropdownList: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  societyContainer: {
    position: "relative",
    marginBottom: 8,
  },
  societyDropdownList: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 30,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Montserrat-Regular",
  },
  createNewItem: {
    backgroundColor: "#F0F8FF",
  },
  createNewText: {
    fontSize: 16,
    color: "#3575EC",
    fontStyle: "italic",
    fontFamily: "Montserrat-Regular",
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
});
