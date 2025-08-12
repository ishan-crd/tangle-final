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
import { societyService, stateService } from "../../lib/supabase";

SplashScreen.preventAutoHideAsync();
const { height } = Dimensions.get("window");



export default function AddressScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useUser();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [society, setSociety] = useState("");
  const [flat, setFlat] = useState("");
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedSociety, setSelectedSociety] = useState<any>(null);
  const [societySearch, setSocietySearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showSocietyDropdown, setShowSocietyDropdown] = useState(false);
  const [filteredSocieties, setFilteredSocieties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);

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

  // Load states and societies from database
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingData(true);
        
        // Load states (using the correct UUID for India)
        const statesData = await stateService.getStatesByCountry("550e8400-e29b-41d4-a716-446655440001");
        setStates(statesData);
        
        // Load all societies
        const societiesData = await societyService.getAllSocieties();
        setSocieties(societiesData);
        
      } catch (error) {
        console.error("Error loading states/societies:", error);
        // Fallback to hardcoded data if database fails
        setStates([
          { id: "550e8400-e29b-41d4-a716-446655440002", name: "Delhi", code: "DL" },
          { id: "550e8400-e29b-41d4-a716-446655440003", name: "Maharashtra", code: "MH" },
          { id: "550e8400-e29b-41d4-a716-446655440004", name: "Karnataka", code: "KA" },
          { id: "550e8400-e29b-41d4-a716-446655440005", name: "Uttar Pradesh", code: "UP" },
          { id: "550e8400-e29b-41d4-a716-446655440006", name: "Haryana", code: "HR" },
          { id: "550e8400-e29b-41d4-a716-446655440007", name: "Telangana", code: "TS" },
          { id: "550e8400-e29b-41d4-a716-446655440008", name: "Tamil Nadu", code: "TN" },
          { id: "550e8400-e29b-41d4-a716-446655440009", name: "West Bengal", code: "WB" },
          { id: "550e8400-e29b-41d4-a716-446655440010", name: "Gujarat", code: "GJ" },
          { id: "550e8400-e29b-41d4-a716-446655440011", name: "Punjab", code: "PB" },
        ]);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Initialize fields with existing user data
  useEffect(() => {
    if (user && !isLoadingData) {
      if (user.society) {
        setSociety(user.society);
        setSocietySearch(user.society);
      }
      if (user.flat) {
        setFlat(user.flat);
      }
      if (user.state_id) {
        const userState = states.find(state => state.id === user.state_id);
        if (userState) {
          setSelectedState(userState);
        }
      }
      if (user.society_id) {
        const userSociety = societies.find(society => society.id === user.society_id);
        if (userSociety) {
          setSelectedSociety(userSociety);
        }
      }
    }
  }, [user, states, societies, isLoadingData]);

  useEffect(() => {
    if (societySearch.trim()) {
      filterSocieties();
    } else if (selectedState) {
      const stateSocieties = societies.filter(society => 
        society.state_id === selectedState.id || 
        society.states?.name === selectedState.name
      );
      setFilteredSocieties(stateSocieties);
    }
  }, [societySearch, selectedState, societies]);

  const filterSocieties = () => {
    if (!selectedState) return;
    
    const stateSocieties = societies.filter(society => 
      society.state_id === selectedState.id || 
      society.states?.name === selectedState.name
    );
    const filtered = stateSocieties.filter(society =>
      society.name.toLowerCase().includes(societySearch.toLowerCase())
    );
    setFilteredSocieties(filtered);
  };

  const handleStateSelect = (state: any) => {
    setSelectedState(state);
    setSelectedSociety(null);
    setSociety("");
    setSocietySearch("");
    setFilteredSocieties([]);
    setShowStateDropdown(false);
    setShowSocietyDropdown(true);
  };

  const handleSocietySelect = (societyData: any) => {
    setSociety(societyData.name);
    setSocietySearch(societyData.name);
    setSelectedSociety(societyData);
    setShowSocietyDropdown(false);
  };

  const handleCreateNewSociety = async () => {
    if (societySearch.trim() && selectedState) {
      try {
        // Create new society in database
        const newSociety = await societyService.createSociety({
          state_id: selectedState.id,
          name: societySearch.trim(),
          address: ""
        });
        
        setSociety(newSociety.name);
        setSocietySearch(newSociety.name);
        setSelectedSociety(newSociety);
        setShowSocietyDropdown(false);
        
        // Refresh societies list
        const updatedSocieties = await societyService.getAllSocieties();
        setSocieties(updatedSocieties);
      } catch (error) {
        console.error("Error creating society:", error);
        Alert.alert("Error", "Failed to create new society");
      }
    }
  };

  const validateSociety = (society: string) => {
    if (!society.trim()) {
      return "Please select or enter your society name";
    }
    if (society.trim().length < 2) {
      return "Society name must be at least 2 characters long";
    }
    return "";
  };

  const validateFlat = (flat: string) => {
    if (!flat.trim()) {
      return "Please enter your flat number";
    }
    if (flat.trim().length < 1) {
      return "Flat number is required";
    }
    return "";
  };

  const handleNext = async () => {
    const societyError = validateSociety(society);
    const flatError = validateFlat(flat);

    const newErrors: {[key: string]: string} = {};
    if (societyError) newErrors.society = societyError;
    if (flatError) newErrors.flat = flatError;

    setErrors(newErrors);

    if (societyError || flatError) {
      return;
    }

    if (!selectedState) {
      Alert.alert("Error", "Please select your state");
      return;
    }

    setIsLoading(true);
    try {
      let finalSocietyId = selectedSociety?.id;
      
      // If no society was selected from dropdown but society name was entered,
      // try to find the existing society or create a new one
      if (!finalSocietyId && society.trim()) {
        try {
          const existingSociety = await societyService.getSocietyByName(society.trim());
          if (existingSociety) {
            finalSocietyId = existingSociety.id;
          } else {
            // Create new society if it doesn't exist
            const newSociety = await societyService.createSociety({
              state_id: selectedState.id,
              name: society.trim(),
              address: ""
            });
            finalSocietyId = newSociety.id;
          }
        } catch (error) {
          console.error('Error finding/creating society:', error);
          // Continue without society_id if there's an error
        }
      }
      
      await updateUserProfile({
        society: society.trim(),
        flat: flat.trim(),
        society_id: finalSocietyId,
        state_id: selectedState.id
      });
      
      router.push("/onboarding/interestscreen");
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert("Error", "Failed to save address information");
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
                // Clear the selected society when user starts typing
                if (selectedSociety) {
                  setSelectedSociety(null);
                  setSociety("");
                }
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
                  {filteredSocieties.map((societyData, index) => (
                    <TouchableOpacity
                      key={societyData.id || index}
                      style={styles.dropdownItem}
                      onPress={() => handleSocietySelect(societyData)}
                    >
                      <Text style={styles.dropdownItemText}>{societyData.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {societySearch.trim() && !filteredSocieties.some(s => s.name.toLowerCase() === societySearch.toLowerCase()) && (
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
