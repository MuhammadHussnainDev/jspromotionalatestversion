import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Easing,
  PanResponder,
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';

const FlyerScreen = ({route, navigation}: any) => {
  const {deal} = route.params; // Get the deal content from props
  const animatedHeight = useRef(new Animated.Value(50)).current; // Animated value for smooth transitions
  const [lastScrollY, setLastScrollY] = useState(0); // Track last Y position for scroll direction

  const MIN_HEIGHT = 50; // Minimum height of the bottom sheet
  const MAX_HEIGHT = 150; // Maximum height of the bottom sheet

  // Smoothly animate the bottom sheet height
  const animateBottomSheet = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  // Handle scroll event for automatic adjustment
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY + 20) {
      // Scrolled downward - Open BottomSheet
      animateBottomSheet(MAX_HEIGHT);
    } else if (currentScrollY < lastScrollY - 20) {
      // Scrolled upward - Close BottomSheet
      animateBottomSheet(MIN_HEIGHT);
    }

    setLastScrollY(currentScrollY); // Update the last scroll position
  };

  // PanResponder for drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedHeight.stopAnimation(); // Stop any ongoing animation
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, MAX_HEIGHT - gestureState.dy),
        );
        animatedHeight.setValue(newHeight); // Update height dynamically
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Snap to nearest state (expanded or collapsed) upon release
        if (gestureState.dy > 50) {
          animateBottomSheet(MIN_HEIGHT);
        } else {
          animateBottomSheet(MAX_HEIGHT);
        }
      },
    }),
  ).current;

  // Share flyer content
  // const handleShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       message: `Check out this amazing deal: ${deal.title}\n\nValid from ${deal.validFrom} to ${deal.validTo}\n\nSee it here: https://tinynote.in/ofo/public/assests/proimg/${deal.image}`,
  //     });

  //     if (result.action === Share.sharedAction) {
  //       console.log('Shared successfully');
  //     } else if (result.action === Share.dismissedAction) {
  //       console.log('Share dismissed');
  //     }
  //   } catch (error: any) {
  //     console.error('Error sharing flyer:', error.message);
  //   }
  // };

  const handleShare = async () => {
    try {
      if (!deal.image) {
        console.error('Image is missing in deal object');
        return;
      }

      // Ensure the image is a Base64 URI
      const isBase64Image = deal.image.startsWith('data:image/');
      if (!isBase64Image) {
        console.error('Image is not in Base64 format');
        return;
      }

      // Extract the Base64 data from the image URI
      const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
      const fileExtension =
        deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';

      // Define a temporary file path
      const filePath = `${RNFS.DocumentDirectoryPath}/flyer.${fileExtension}`;

      // Write the Base64 data to a temporary file
      await RNFS.writeFile(filePath, base64Data, 'base64');

      // Share the file
      const result = await Share.share({
        message: `Check out this amazing deal: ${deal.title}\n\nValid from ${deal.validFrom} to ${deal.validTo}\n\nSee the flyer below!`,
        url: `file://${filePath}`,
      });

      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      console.error('Error sharing flyer:', error.message);
    }
  };

  // return (
  //   <View style={styles.container}>
  //     {/* Header */}
  //     <View style={styles.header}>
  //       <TouchableOpacity onPress={() => navigation.goBack()}>
  //         <Icon name="arrow-back" size={24} color="#000000" />
  //       </TouchableOpacity>
  //       <Text style={styles.headerTitle}>{deal.name}</Text>
  //       <View style={styles.headerIcons}>
  //         <TouchableOpacity onPress={handleShare}>
  //           <Icon name="share" size={24} color="#000000" style={styles.icon} />
  //         </TouchableOpacity>
  //         {/* <TouchableOpacity>
  //           <Icon
  //             name="chat-bubble-outline"
  //             size={24}
  //             color="#000000"
  //             style={styles.icon}
  //           />
  //         </TouchableOpacity> */}
  //         <TouchableOpacity>
  //           <Icon
  //             name="more-vert"
  //             size={24}
  //             color="#000000"
  //             style={styles.icon}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //     </View>

  //     {/* Store Info */}
  //     <View style={styles.storeInfo}>
  //       <Text style={styles.storeTitle}>{deal.title}</Text>
  //       <Text style={styles.description}>{deal.description}</Text>
  //       <Text style={styles.dateRange}>
  //         Valid: {deal.validFrom} to {deal.validTo}
  //       </Text>
  //     </View>

  //     {/* Flyer Content */}
  //     <ScrollView
  //       style={styles.flyerContent}
  //       onScroll={handleScroll}
  //       scrollEventThrottle={16} // Frequency of onScroll event
  //     >
  //       <View style={styles.flyerSection}>
  //         <Image
  //           source={{uri: deal.image}}
  //           style={styles.flyerImage}
  //           resizeMode="cover"
  //         />
  //         <Text style={styles.flyerSubText}>
  //           Explore exclusive deals and offers available for {deal.name}.
  //         </Text>
  //       </View>

  //       {deal?.qrCode && (
  //         <>
  //           <View>
  //             <Image
  //               source={{uri: deal.qrCode}}
  //               style={styles.flyerImage}
  //               resizeMode="cover"
  //             />
  //           </View>
  //         </>
  //       )}
  //     </ScrollView>

  //     {/* Bottom Sheet */}
  //     <Animated.View
  //       {...panResponder.panHandlers}
  //       style={[
  //         styles.bottomSheet,
  //         {height: animatedHeight, maxHeight: animatedHeight},
  //       ]}>
  //       {/* Center Line (Handle) */}
  //       <View style={styles.centerLine} />

  //       <View style={styles.sheetHeader}>
  //         <Text style={styles.sheetTitle}>{deal.name}</Text>
  //       </View>
  //       <View style={styles.sheetActions}>
  //         <TouchableOpacity
  //           onPress={handleShare}
  //           style={styles.shareDealButton}>
  //           <Text style={styles.shareDealText}>Share Deal</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </Animated.View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{deal.name}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share" size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="more-vert"
              size={24}
              color="#000000"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Store Info */}
      <View style={styles.storeInfo}>
        <Text style={styles.storeTitle}>{deal.title}</Text>
        <Text style={styles.description}>{deal.description}</Text>
        <Text style={styles.dateRange}>
          Valid: {deal.validFrom} to {deal.validTo}
        </Text>
      </View>

      {/* Flyer Content */}
      <ScrollView
        style={styles.flyerContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={styles.flyerSection}>
          <Image
            source={{uri: deal.image}}
            style={styles.flyerImage}
            resizeMode="cover"
          />
          <Text style={styles.flyerSubText}>
            Explore exclusive deals and offers available for {deal.name}.
          </Text>
        </View>

        <View style={styles.qrCodeContainer}>
          {deal?.storeQrCode || deal?.brandQrCode ? (
            <>
              <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
              <Image
                source={{uri: deal.storeQrCode || deal.brandQrCode}}
                style={styles.qrCodeImage}
                resizeMode="contain"
              />
            </>
          ) : (
            <Text style={styles.qrCodeTitle}>QR Code not available</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.bottomSheet,
          {height: animatedHeight, maxHeight: animatedHeight},
        ]}>
        <View style={styles.centerLine} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{deal.name}</Text>
        </View>
        <View style={styles.sheetActions}>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.shareDealButton}>
            <Text style={styles.shareDealText}>Share Deal</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  storeInfo: {
    alignItems: 'flex-start',
    padding: 10,
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  storeTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 14,
    color: '#000000',
    marginTop: 5,
  },
  flyerContent: {
    padding: 10,
  },
  flyerSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  flyerImage: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  flyerSubText: {
    color: '#000000',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#293B4F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  centerLine: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareDealButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C6EF5',
  },
  shareDealText: {
    color: '#4C6EF5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 200,
  },
  qrCodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
});

export default FlyerScreen;
