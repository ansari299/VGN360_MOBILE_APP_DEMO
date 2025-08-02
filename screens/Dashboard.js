import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  Animated,
  Easing,
  Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from './AuthContext';
const { width, height } = Dimensions.get('window');

// Using emoji as built-in icons
const FormIcon = () => <Text style={styles.icon}>📝</Text>;
const HistoryIcon = () => <Text style={styles.icon}>🧾</Text>;
const ReferIcon = () => <Text style={styles.icon}>🤝</Text>;

export default function Dashboard({ route }) {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const mobile = authData.mobile;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [referrerData, setReferrerData] = useState(null);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const buttonScale1 = useRef(new Animated.Value(1)).current;
  const buttonScale2 = useRef(new Animated.Value(1)).current;
  const buttonScale3 = useRef(new Animated.Value(1)).current;

  // Calculate available height for carousel
  const headerHeight = 100;
  const buttonsHeight = 100;
  const carouselHeight = height - headerHeight - buttonsHeight - 80;

  // Image aspect ratio
  const imageAspectRatio = 830 / 1270;
  const imageWidth = width - 40;
  const imageHeight = imageWidth / imageAspectRatio;

  const carouselItems = [
    { 
      id: 1, 
      title: '', 
      image: require('../assets/1.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
    { 
      id: 2, 
      title: '', 
      image: require('../assets/2.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
    { 
      id: 3, 
      title: '', 
      image: require('../assets/3.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
    { 
      id: 4, 
      title: '', 
      image: require('../assets/4.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
    { 
      id: 5, 
      title: '', 
      image: require('../assets/5.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
    { 
      id: 6, 
      title: '', 
      image: require('../assets/6.jpg'),
      url: 'https://www.vgnhomes.org/' 
    },
  ];

  // Fetch referrer data
  useEffect(() => {
    const fetchReferrerData = async () => {
      try {
        const response = await fetch(
          `https://www.vgn360.com/MobileApp_API/GetCustomerName?MobileNo=${mobile}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setReferrerData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching referrer data:', error);
      }
    };

    if (mobile) {
      fetchReferrerData();
    }
  }, [mobile]);

  // Auto-scroll carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= carouselItems.length) {
        nextIndex = 0;
      }
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true
      });
      
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleButtonPress = (screen, buttonScale) => {
    // Only use native driver for scale animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      })
    ]).start(() => {
      navigation.navigate(screen);
    });
  };


  const handleImagePress = async (url) => {
  try {
    // Add https if not present
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    // Check if URL can be opened
    const supported = await Linking.canOpenURL(formattedUrl);
    
    if (supported) {
      await Linking.openURL(formattedUrl);
    } else {
      console.log("Don't know how to open URI: " + formattedUrl);
    
     
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    // Show error to user
   
  }
};

  // Display name or mobile number
  const displayName = referrerData?.CustomerName || `+91 ${mobile}`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../assets/vgn360-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>{displayName}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Animated.View style={{ transform: [{ scale: buttonScale1 }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.enquiryButton]}
            onPress={() => handleButtonPress('EnquiryForm', buttonScale1)}
            activeOpacity={0.8}
          >
            <FormIcon />
            <Text style={[styles.buttonText, styles.enquiryText]}>ENQUIRY FORM</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale3 }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.referButton]}
            onPress={() => handleButtonPress('ReferalForm', buttonScale3)}
            activeOpacity={0.8}
          >
            <ReferIcon />
            <Text style={[styles.buttonText, styles.referText]}>REFER & EARN</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: buttonScale2 }] }}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.historyButton]}
            onPress={() => handleButtonPress('BookedHistory', buttonScale2)}
            activeOpacity={0.8}
          >
            <HistoryIcon />
            <Text style={[styles.buttonText, styles.historyText]}>BOOKED HISTORY</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Carousel Section */}
      <View style={[styles.carouselContainer, {height: carouselHeight}]}>
        <Text style={styles.sectionTitle}>Ongoing Projects</Text>
        <FlatList
          ref={flatListRef}
          data={carouselItems}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } }}],
            { useNativeDriver: false } // Keep this false for scroll animations
          )}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={[styles.carouselItem, { width }]}>
              <TouchableOpacity 
                onPress={() => handleImagePress(item.url)}
                activeOpacity={0.9}
              >
                <View style={[styles.imageContainer, {width: imageWidth, height: imageHeight}]}>
                  <Image 
                    source={item.image} 
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index
          })}
        />
        <View style={styles.indicatorContainer}>
          {carouselItems.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.indicator,
                  { opacity },
                  currentIndex === index && styles.activeIndicator
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    tintColor: '#b4151a',
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  icon: {
    fontSize: 40,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: width * 0.28,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  enquiryButton: {
    borderColor: '#b4151a',
  },
  historyButton: {
    borderColor: '#2c3e50',
  },
  referButton: {
    borderColor: '#27ae60',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  enquiryText: {
    color: '#b4151a',
  },
  historyText: {
    color: '#2c3e50',
  },
  referText: {
    color: '#27ae60',
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b4151a',
    marginHorizontal: 10,
    marginBottom: 15,
    // alignSelf: 'flex-start',
      alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#b4151a',
    width: 20,
  },
});