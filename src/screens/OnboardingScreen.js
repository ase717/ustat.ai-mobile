import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');

// Gradient circle component
const GradientCircle = ({ style, colors, size = 160 }) => (
  <View style={[styles.gradientCircleContainer, style]}>
    <LinearGradient
      colors={colors}
      style={[styles.gradientCircle, { width: size, height: size, borderRadius: size / 2 }]}
    />
  </View>
);

// Onboarding slide component
const OnboardingSlide = ({ item, index }) => {
  // Create animated opacity
  const opacity = useSharedValue(0);
  
  // Start animation when component mounts
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
  }, []);
  
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ 
        translateY: opacity.value * 0 + (1 - opacity.value) * 50
      }]
    };
  });
  
  return (
    <View style={styles.slideContainer}>
      {/* Background gradient circles - different for each slide */}
      {index === 0 && (
        <>
          <GradientCircle 
            style={{ position: 'absolute', top: 80, right: -60 }}
            colors={['rgba(59, 223, 240, 0.2)', 'transparent']}
            size={180}
          />
          <GradientCircle 
            style={{ position: 'absolute', top: 300, left: -60 }}
            colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
            size={160}
          />
        </>
      )}
      
      {index === 1 && (
        <>
          <GradientCircle 
            style={{ position: 'absolute', top: 80, left: -60 }}
            colors={['rgba(240, 59, 130, 0.2)', 'transparent']}
            size={180}
          />
          <GradientCircle 
            style={{ position: 'absolute', top: 300, right: -40 }}
            colors={['rgba(74, 15, 235, 0.2)', 'transparent']}
            size={140}
          />
        </>
      )}
      
      {index === 2 && (
        <>
          <GradientCircle 
            style={{ position: 'absolute', top: 60, right: -40 }}
            colors={['rgba(240, 128, 59, 0.2)', 'transparent']}
            size={160}
          />
          <GradientCircle 
            style={{ position: 'absolute', top: 350, left: -50 }}
            colors={['rgba(15, 74, 235, 0.3)', 'transparent']}
            size={150}
          />
        </>
      )}
      
      {index === 3 && (
        <>
          <GradientCircle 
            style={{ position: 'absolute', top: 80, left: -40 }}
            colors={['rgba(59, 240, 150, 0.2)', 'transparent']}
            size={160}
          />
          <GradientCircle 
            style={{ position: 'absolute', top: 350, right: -60 }}
            colors={['rgba(74, 15, 235, 0.3)', 'transparent']}
            size={150}
          />
        </>
      )}
      
      {/* Slide content */}
      <Animated.View style={[styles.slideTextContainer, textAnimatedStyle]}>
        <Ionicons 
          name={item.icon} 
          size={80} 
          color={colors.primary.main} 
          style={styles.slideIcon}
        />
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

const OnboardingScreen = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Data for slides
  const slides = [
    {
      id: '1',
      title: 'Anlamsal ve Bağlamsal Arama',
      description: 'İçtihat ve Literatür araştırmalarını yapay zeka destekli hibrit arama teknolojisi ile tamamlayın.',
      icon: 'search-outline'
    },
    {
      id: '2',
      title: 'Yapay Zeka ile Hukuki Hesaplama',
      description: 'İnfaz, tazminat, işçilik alacakları gibi karmaşık hesaplamaları saniyeler içinde tamamlayın.',
      icon: 'calculator-outline'
    },
    {
      id: '3',
      title: 'Hukuki Proje Yönetimi',
      description: 'Müvekkilleriniz için araştırma projeleri oluşturun. Projelerinize içtihat, literatür, hesaplama ve dilekçe kaydedin.',
      icon: 'folder-open-outline'
    },
    {
      id: '4',
      title: 'Akıllı Belge Üretimi',
      description: 'Dilekçe ve sözleşmeleri, yapay zeka destekli akıllı belge üretimi ile oluşturun ve mevcut belgelerinizi analiz edin.',
      icon: 'document-text-outline'
    }
  ];
  
  // Handle scroll events to track current slide
  const handleViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };
  
  // Skip all slides
  const skipOnboarding = () => {
    onFinish('Register');  // Navigate specifically to Register screen
  };
  
  // Go to next slide
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last slide, finish onboarding
      onFinish('Register');  // Navigate specifically to Register screen
    }
  };
  
  return (
    <LinearGradient
      colors={['#131313', '#1F1F1F']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131313" />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <OnboardingSlide item={item} index={index} />
        )}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
        scrollEventThrottle={32}
        decelerationRate="fast"
        bounces={false}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot
              ]} 
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={skipOnboarding}
            >
              <Text style={styles.skipButtonText}>Atla</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
          
          <Button
            mode="contained"
            style={styles.nextButton}
            labelStyle={styles.nextButtonText}
            onPress={goToNextSlide}
          >
            {currentIndex === slides.length - 1 ? 'Başla' : 'İleri'}
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  gradientCircleContainer: {
    overflow: 'hidden',
    zIndex: 0,
  },
  gradientCircle: {
    opacity: 0.8,
  },
  slideTextContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  slideIcon: {
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  slideDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 28,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
  },
  spacer: {
    width: 60,
  },
  nextButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default OnboardingScreen;
