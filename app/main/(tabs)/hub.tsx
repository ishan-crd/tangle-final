import { router } from "expo-router";
import {
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function HubScreen() {
  const handleTournamentsPress = () => {
    router.push("/main/tournaments");
  };

  const handleCommunityEventsPress = () => {
    router.push("/main/community-events");
  };

  const handleInterestCirclesPress = () => {
    router.push("/main/interest-circles");
  };

  const InterestCirclesCard = () => (
    <TouchableOpacity style={[styles.bottomCard, styles.interestCirclesCard]} onPress={handleInterestCirclesPress}>
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>👥</Text>
        <Text style={styles.cardTitle}>Interest Circles</Text>
        <Text style={styles.cardSubtitle}>Connect with like-minded people</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search and Feature Buttons Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.featureButtons}>
          <TouchableOpacity style={[styles.featureButton, styles.lockedFeature]}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.featureText}>Offers</Text>
            <Text style={styles.featureEmoji}>🍔</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.featureButton, styles.lockedFeature]}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.featureText}>Polls</Text>
            <Text style={styles.featureEmoji}>📊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.featureButton, styles.lockedFeature]}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.featureText}>Slot Books</Text>
            <Text style={styles.featureEmoji}>✨</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events and Tournaments Section */}
      <View style={styles.eventsSection}>
        <View style={styles.eventRow}>
          <TouchableOpacity 
            style={[styles.eventCard, styles.tournamentsCard]}
            onPress={handleTournamentsPress}
          >
            <View style={styles.activeLabel}>
              <Text style={styles.activeLabelText}>3 active tournaments</Text>
            </View>
            <Text style={styles.eventTitle}>Tournaments</Text>
            <Text style={styles.eventDescription}>Time to prove you're not just bragging in the WhatsApp group</Text>
            {Platform.OS === "ios" ? (
              <Text style={styles.eventIcon}>🏆</Text>
            ) : null}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.eventCard, styles.communityEventsCard]}
            onPress={handleCommunityEventsPress}
          >
            <View style={styles.activeLabel}>
              <Text style={styles.activeLabelText}>1 active event</Text>
            </View>
            <Text style={styles.eventTitle}>Community Events</Text>
            <Text style={styles.eventDescription}>Fun guaranteed your time back!</Text>
            {Platform.OS === "ios" ? (
              <View style={styles.globeContainer}>
                <Text style={styles.globeIcon}>🌐</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Section (Locked) */}
      <View style={styles.mapSection}>
        <View style={styles.mapContainer}>
          <ImageBackground 
            source={require('../../../assets/images/map.jpg')} 
            style={styles.mapContent}
            resizeMode="cover"
          >
            {/* Location Marker */}
            <View style={styles.locationMarker}>
              <View style={styles.markerDot}></View>
              <View style={styles.markerPulse}></View>
            </View>
            
            {/* Location Info Bubble */}
            <View style={styles.locationBubble}>
              <Text style={styles.locationBubbleText}>From 562/11-A</Text>
            </View>
          </ImageBackground>
          
          {/* Lock Overlay */}
          <View style={styles.mapLockOverlay}>
            <Text style={styles.mapLockIcon}>🔒</Text>
            <Text style={styles.mapLockText}>Map Feature</Text>
            <Text style={styles.mapLockSubtext}>Coming Soon</Text>
          </View>
        </View>
      </View>

      {/* Interest Circles and Announcements Section */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomRow}>
          <InterestCirclesCard />
          
          <TouchableOpacity style={[styles.bottomCard, styles.announcementsCard]}>
            <Text style={styles.bottomCardTitle}>Announcements</Text>
            <Text style={styles.bottomCardDescription}>Society news that actually matters</Text>
            {Platform.OS === "ios" ? (
              <View style={styles.lockedContent}>
                <Text style={styles.largeLockIcon}>🔒</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "android" ? 0 : 50, // Remove gap on Android
  },
  
  // Search Section
  searchSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  featureButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureButton: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  lockedFeature: {
    opacity: 0.6,
  },
  lockIcon: {
    fontSize: 16,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  featureEmoji: {
    fontSize: 16,
  },
  
  // Events Section
  eventsSection: {
    padding: 20,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventCard: {
    width: "48%",
    aspectRatio: Platform.OS === "android" ? 1.1 : 1, // Slightly taller on Android for emoji visibility
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: "space-between",
  },
  tournamentsCard: {
    backgroundColor: "#FFE4D6",
  },
  communityEventsCard: {
    backgroundColor: "#F0F0F0",
  },
  activeLabel: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  activeLabelText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  eventDescription: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: Platform.OS === "android" ? 36 : 28,
    lineHeight: Platform.OS === "android" ? 42 : undefined,
    textAlign: "center",
    includeFontPadding: false,
  },
  lockedContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  largeLockIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  globeIcon: {
    fontSize: Platform.OS === "android" ? 40 : 32,
    lineHeight: Platform.OS === "android" ? 44 : undefined,
    textAlign: "center",
    includeFontPadding: false,
  },
  globeContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  
  // Map Section
  mapSection: {
    padding: 20,
  },
  mapContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  mapContent: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  locationMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -10,
    marginTop: -10,
  },
  markerDot: {
    width: 20,
    height: 20,
    backgroundColor: "#000",
    borderRadius: 10,
    position: "absolute",
    zIndex: 2,
  },
  markerPulse: {
    width: 40,
    height: 40,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    opacity: 0.3,
    position: "absolute",
    marginLeft: -10,
    marginTop: -10,
  },
  locationBubble: {
    position: "absolute",
    top: "40%",
    right: "20%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationBubbleText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  mapLockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  mapLockIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  mapLockText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mapLockSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
  },
  
  // Bottom Section
  bottomSection: {
    padding: 20,
    paddingBottom: 40,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomCard: {
    width: "48%",
    aspectRatio: Platform.OS === "android" ? 1.1 : 1, // Slightly taller on Android
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  interestCirclesCard: {
    backgroundColor: "#E8F5E8",
  },
  announcementsCard: {
    backgroundColor: "#FFE6F2",
  },
  bottomCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  bottomCardDescription: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
    marginBottom: 12,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#E8F5E8",
    padding: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
  },
  cardIcon: {
    fontSize: Platform.OS === "android" ? 44 : 36,
    lineHeight: Platform.OS === "android" ? 48 : undefined,
    marginBottom: 8,
    includeFontPadding: false,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
}); 