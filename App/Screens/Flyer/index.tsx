// // import React, {useRef, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   Image,
// //   Animated,
// //   Easing,
// //   PanResponder,
// //   Share,
// //   NativeSyntheticEvent,
// //   NativeScrollEvent,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import RNFS from 'react-native-fs';

// // const FlyerScreen = ({route, navigation}: any) => {
// //   const {deal} = route.params; // Get the deal content from props
// //   const animatedHeight = useRef(new Animated.Value(50)).current; // Animated value for smooth transitions
// //   const [lastScrollY, setLastScrollY] = useState(0); // Track last Y position for scroll direction

// //   const MIN_HEIGHT = 50; // Minimum height of the bottom sheet
// //   const MAX_HEIGHT = 150; // Maximum height of the bottom sheet

// //   // Smoothly animate the bottom sheet height
// //   const animateBottomSheet = (toValue: number) => {
// //     Animated.timing(animatedHeight, {
// //       toValue,
// //       duration: 300,
// //       easing: Easing.inOut(Easing.ease),
// //       useNativeDriver: false,
// //     }).start();
// //   };

// //   // Handle scroll event for automatic adjustment
// //   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
// //     const currentScrollY = event.nativeEvent.contentOffset.y;

// //     if (currentScrollY > lastScrollY + 20) {
// //       // Scrolled downward - Open BottomSheet
// //       animateBottomSheet(MAX_HEIGHT);
// //     } else if (currentScrollY < lastScrollY - 20) {
// //       // Scrolled upward - Close BottomSheet
// //       animateBottomSheet(MIN_HEIGHT);
// //     }

// //     setLastScrollY(currentScrollY); // Update the last scroll position
// //   };

// //   // PanResponder for drag gestures
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onMoveShouldSetPanResponder: () => true,
// //       onPanResponderGrant: () => {
// //         animatedHeight.stopAnimation(); // Stop any ongoing animation
// //       },
// //       onPanResponderMove: (evt, gestureState) => {
// //         const newHeight = Math.max(
// //           MIN_HEIGHT,
// //           Math.min(MAX_HEIGHT, MAX_HEIGHT - gestureState.dy),
// //         );
// //         animatedHeight.setValue(newHeight); // Update height dynamically
// //       },
// //       onPanResponderRelease: (evt, gestureState) => {
// //         // Snap to nearest state (expanded or collapsed) upon release
// //         if (gestureState.dy > 50) {
// //           animateBottomSheet(MIN_HEIGHT);
// //         } else {
// //           animateBottomSheet(MAX_HEIGHT);
// //         }
// //       },
// //     }),
// //   ).current;

// //   // Share flyer content
// //   // const handleShare = async () => {
// //   //   try {
// //   //     const result = await Share.share({
// //   //       message: `Check out this amazing deal: ${deal.title}\n\nValid from ${deal.validFrom} to ${deal.validTo}\n\nSee it here: https://tinynote.in/ofo/public/assests/proimg/${deal.image}`,
// //   //     });

// //   //     if (result.action === Share.sharedAction) {
// //   //       console.log('Shared successfully');
// //   //     } else if (result.action === Share.dismissedAction) {
// //   //       console.log('Share dismissed');
// //   //     }
// //   //   } catch (error: any) {
// //   //     console.error('Error sharing flyer:', error.message);
// //   //   }
// //   // };

// //   const handleShare = async () => {
// //     try {
// //       if (!deal.image) {
// //         console.error('Image is missing in deal object');
// //         return;
// //       }

// //       // Ensure the image is a Base64 URI
// //       const isBase64Image = deal.image.startsWith('data:image/');
// //       if (!isBase64Image) {
// //         console.error('Image is not in Base64 format');
// //         return;
// //       }

// //       // Extract the Base64 data from the image URI
// //       const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
// //       const fileExtension =
// //         deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';

// //       // Define a temporary file path
// //       const filePath = `${RNFS.DocumentDirectoryPath}/flyer.${fileExtension}`;

// //       // Write the Base64 data to a temporary file
// //       await RNFS.writeFile(filePath, base64Data, 'base64');

// //       // Share the file
// //       const result = await Share.share({
// //         message: `Check out this amazing deal: ${deal.title}\n\nValid from ${deal.validFrom} to ${deal.validTo}\n\nSee the flyer below!`,
// //         url: `file://${filePath}`,
// //       });

// //       if (result.action === Share.sharedAction) {
// //         console.log('Shared successfully');
// //       } else if (result.action === Share.dismissedAction) {
// //         console.log('Share dismissed');
// //       }
// //     } catch (error: any) {
// //       console.error('Error sharing flyer:', error.message);
// //     }
// //   };

// //   // return (
// //   //   <View style={styles.container}>
// //   //     {/* Header */}
// //   //     <View style={styles.header}>
// //   //       <TouchableOpacity onPress={() => navigation.goBack()}>
// //   //         <Icon name="arrow-back" size={24} color="#000000" />
// //   //       </TouchableOpacity>
// //   //       <Text style={styles.headerTitle}>{deal.name}</Text>
// //   //       <View style={styles.headerIcons}>
// //   //         <TouchableOpacity onPress={handleShare}>
// //   //           <Icon name="share" size={24} color="#000000" style={styles.icon} />
// //   //         </TouchableOpacity>
// //   //         {/* <TouchableOpacity>
// //   //           <Icon
// //   //             name="chat-bubble-outline"
// //   //             size={24}
// //   //             color="#000000"
// //   //             style={styles.icon}
// //   //           />
// //   //         </TouchableOpacity> */}
// //   //         <TouchableOpacity>
// //   //           <Icon
// //   //             name="more-vert"
// //   //             size={24}
// //   //             color="#000000"
// //   //             style={styles.icon}
// //   //           />
// //   //         </TouchableOpacity>
// //   //       </View>
// //   //     </View>

// //   //     {/* Store Info */}
// //   //     <View style={styles.storeInfo}>
// //   //       <Text style={styles.storeTitle}>{deal.title}</Text>
// //   //       <Text style={styles.description}>{deal.description}</Text>
// //   //       <Text style={styles.dateRange}>
// //   //         Valid: {deal.validFrom} to {deal.validTo}
// //   //       </Text>
// //   //     </View>

// //   //     {/* Flyer Content */}
// //   //     <ScrollView
// //   //       style={styles.flyerContent}
// //   //       onScroll={handleScroll}
// //   //       scrollEventThrottle={16} // Frequency of onScroll event
// //   //     >
// //   //       <View style={styles.flyerSection}>
// //   //         <Image
// //   //           source={{uri: deal.image}}
// //   //           style={styles.flyerImage}
// //   //           resizeMode="cover"
// //   //         />
// //   //         <Text style={styles.flyerSubText}>
// //   //           Explore exclusive deals and offers available for {deal.name}.
// //   //         </Text>
// //   //       </View>

// //   //       {deal?.qrCode && (
// //   //         <>
// //   //           <View>
// //   //             <Image
// //   //               source={{uri: deal.qrCode}}
// //   //               style={styles.flyerImage}
// //   //               resizeMode="cover"
// //   //             />
// //   //           </View>
// //   //         </>
// //   //       )}
// //   //     </ScrollView>

// //   //     {/* Bottom Sheet */}
// //   //     <Animated.View
// //   //       {...panResponder.panHandlers}
// //   //       style={[
// //   //         styles.bottomSheet,
// //   //         {height: animatedHeight, maxHeight: animatedHeight},
// //   //       ]}>
// //   //       {/* Center Line (Handle) */}
// //   //       <View style={styles.centerLine} />

// //   //       <View style={styles.sheetHeader}>
// //   //         <Text style={styles.sheetTitle}>{deal.name}</Text>
// //   //       </View>
// //   //       <View style={styles.sheetActions}>
// //   //         <TouchableOpacity
// //   //           onPress={handleShare}
// //   //           style={styles.shareDealButton}>
// //   //           <Text style={styles.shareDealText}>Share Deal</Text>
// //   //         </TouchableOpacity>
// //   //       </View>
// //   //     </Animated.View>
// //   //   </View>
// //   // );

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Icon name="arrow-back" size={24} color="#000000" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>{deal.name}</Text>
// //         <View style={styles.headerIcons}>
// //           <TouchableOpacity onPress={handleShare}>
// //             <Icon name="share" size={24} color="#000000" style={styles.icon} />
// //           </TouchableOpacity>
// //           <TouchableOpacity>
// //             <Icon
// //               name="more-vert"
// //               size={24}
// //               color="#000000"
// //               style={styles.icon}
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* Store Info */}
// //       <View style={styles.storeInfo}>
// //         <Text style={styles.storeTitle}>{deal.title}</Text>
// //         <Text style={styles.description}>{deal.description}</Text>
// //         <Text style={styles.dateRange}>
// //           Valid: {deal.validFrom} to {deal.validTo}
// //         </Text>
// //       </View>

// //       {/* Flyer Content */}
// //       <ScrollView
// //         style={styles.flyerContent}
// //         onScroll={handleScroll}
// //         scrollEventThrottle={16}>
// //         <View style={styles.flyerSection}>
// //           <Image
// //             source={{uri: deal.image}}
// //             style={styles.flyerImage}
// //             resizeMode="cover"
// //           />
// //           <Text style={styles.flyerSubText}>
// //             Explore exclusive deals and offers available for {deal.name}.
// //           </Text>
// //         </View>

// //         <View style={styles.qrCodeContainer}>
// //           {deal?.storeQrCode || deal?.brandQrCode ? (
// //             <>
// //               <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
// //               <Image
// //                 source={{uri: deal.storeQrCode || deal.brandQrCode}}
// //                 style={styles.qrCodeImage}
// //                 resizeMode="contain"
// //               />
// //             </>
// //           ) : (
// //             <Text style={styles.qrCodeTitle}>QR Code not available</Text>
// //           )}
// //         </View>
// //       </ScrollView>

// //       {/* Bottom Sheet */}
// //       <Animated.View
// //         {...panResponder.panHandlers}
// //         style={[
// //           styles.bottomSheet,
// //           {height: animatedHeight, maxHeight: animatedHeight},
// //         ]}>
// //         <View style={styles.centerLine} />

// //         <View style={styles.sheetHeader}>
// //           <Text style={styles.sheetTitle}>{deal.name}</Text>
// //         </View>
// //         <View style={styles.sheetActions}>
// //           <TouchableOpacity
// //             onPress={handleShare}
// //             style={styles.shareDealButton}>
// //             <Text style={styles.shareDealText}>Share Deal</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </Animated.View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F8F8FF',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 15,
// //     paddingVertical: 20,
// //   },
// //   headerTitle: {
// //     color: '#000000',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// //   headerIcons: {
// //     flexDirection: 'row',
// //   },
// //   icon: {
// //     marginLeft: 15,
// //   },
// //   storeInfo: {
// //     alignItems: 'flex-start',
// //     padding: 10,
// //     marginLeft: 5,
// //   },
// //   description: {
// //     fontSize: 14,
// //     color: '#555',
// //   },
// //   storeTitle: {
// //     fontSize: 18,
// //     color: '#000000',
// //     fontWeight: 'bold',
// //   },
// //   dateRange: {
// //     fontSize: 14,
// //     color: '#000000',
// //     marginTop: 5,
// //   },
// //   flyerContent: {
// //     padding: 10,
// //   },
// //   flyerSection: {
// //     marginBottom: 20,
// //     alignItems: 'center',
// //   },
// //   flyerImage: {
// //     width: '100%',
// //     height: 400,
// //     borderRadius: 10,
// //     backgroundColor: '#ddd',
// //   },
// //   flyerSubText: {
// //     color: '#000000',
// //     fontSize: 14,
// //     marginTop: 10,
// //     textAlign: 'center',
// //   },
// //   bottomSheet: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: '#293B4F',
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     padding: 20,
// //   },
// //   centerLine: {
// //     width: 40,
// //     height: 5,
// //     backgroundColor: '#ccc',
// //     borderRadius: 2.5,
// //     alignSelf: 'center',
// //     marginBottom: 10,
// //   },
// //   sheetHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 20,
// //   },
// //   sheetTitle: {
// //     color: '#FFFFFF',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   sheetActions: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //   },
// //   shareDealButton: {
// //     flex: 1,
// //     backgroundColor: '#FFFFFF',
// //     padding: 10,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#4C6EF5',
// //   },
// //   shareDealText: {
// //     color: '#4C6EF5',
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //   },
// //   qrCodeContainer: {
// //     alignItems: 'center',
// //     marginVertical: 20,
// //     marginBottom: 200,
// //   },
// //   qrCodeTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#000',
// //   },
// //   qrCodeImage: {
// //     width: 200,
// //     height: 200,
// //   },
// // });

// // export default FlyerScreen;

// ////////////////////////////////////

// /* eslint-disable react-native/no-inline-styles */
// import React, { useRef, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Animated,
//   Easing,
//   PanResponder,
//   Share,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import RNFS from 'react-native-fs';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// type Deal = {
//   name: string;
//   title?: string;
//   description?: string;
//   validFrom?: string;
//   validTo?: string;
//   image?: string; // base64 or remote URL
//   storeQrCode?: string;
//   brandQrCode?: string;
// };

// const MIN_HEIGHT = 56; // bottom sheet collapsed height
// const MAX_HEIGHT = 180; // bottom sheet expanded height

// const isBase64 = (uri?: string) => !!uri && uri.startsWith('data:image/');
// const filenameFromUrl = (url: string) =>
//   url.split('?')[0].split('/').pop() || 'image';

// const FlyerScreen = ({ route, navigation }: any) => {
//   const deal: Deal = route.params?.deal || {};
//   const insets = useSafeAreaInsets();

//   // bottom sheet animation
//   const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const animateBottomSheet = (toValue: number) => {
//     Animated.timing(animatedHeight, {
//       toValue,
//       duration: 280,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: false,
//     }).start();
//   };

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const currentScrollY = event.nativeEvent.contentOffset.y;
//     if (currentScrollY > lastScrollY + 16) {
//       animateBottomSheet(MAX_HEIGHT);
//     } else if (currentScrollY < lastScrollY - 16) {
//       animateBottomSheet(MIN_HEIGHT);
//     }
//     setLastScrollY(currentScrollY);
//   };

//   // drag to expand/collapse
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => animatedHeight.stopAnimation(),
//       onPanResponderMove: (_evt, g) => {
//         const newH = Math.max(
//           MIN_HEIGHT,
//           Math.min(MAX_HEIGHT, MAX_HEIGHT - g.dy),
//         );
//         animatedHeight.setValue(newH);
//       },
//       onPanResponderRelease: (_evt, g) => {
//         if (g.dy > 40) animateBottomSheet(MIN_HEIGHT);
//         else animateBottomSheet(MAX_HEIGHT);
//       },
//     }),
//   ).current;

//   // ---------- Image sizing (aspect ratio) ----------
//   const [flyerAspect, setFlyerAspect] = useState<number | undefined>(undefined);
//   const [qrAspect, setQrAspect] = useState<number | undefined>(1);

//   const onImageLoad = (e: any) => {
//     // RN onLoad nativeEvent.source.{width,height} is widely available
//     const w = e?.nativeEvent?.source?.width;
//     const h = e?.nativeEvent?.source?.height;
//     if (w && h && h !== 0) setFlyerAspect(w / h);
//   };
//   const onQrLoad = (e: any) => {
//     const w = e?.nativeEvent?.source?.width;
//     const h = e?.nativeEvent?.source?.height;
//     if (w && h && h !== 0) setQrAspect(w / h);
//   };

//   // Share: support base64 or URL
//   const handleShare = async () => {
//     try {
//       let filePath: string | undefined;

//       if (deal.image) {
//         if (isBase64(deal.image)) {
//           const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
//           const ext =
//             deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
//           filePath = `${RNFS.CachesDirectoryPath}/flyer.${ext}`;
//           await RNFS.writeFile(filePath, base64Data, 'base64');
//         } else {
//           // remote url -> download to cache for reliable sharing (esp. Android)
//           const fname = filenameFromUrl(deal.image);
//           filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
//           if (!(await RNFS.exists(filePath))) {
//             await RNFS.downloadFile({ fromUrl: deal.image, toFile: filePath })
//               .promise;
//           }
//         }
//       }

//       await Share.share({
//         message: `Check out this deal: ${deal.title || deal.name}\nValid: ${
//           deal.validFrom || ''
//         } to ${deal.validTo || ''}`,
//         url: filePath ? `file://${filePath}` : undefined,
//       });
//     } catch (err: any) {
//       console.error('Error sharing flyer:', err?.message || err);
//     }
//   };

//   const qrUri = useMemo(() => deal.storeQrCode || deal.brandQrCode, [deal]);

//   return (
//     <SafeAreaView edges={['top']} style={styles.safeTop}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//           >
//             <Icon name="arrow-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {deal.name}
//           </Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//               onPress={handleShare}
//               hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//             >
//               <Icon name="share" size={22} color="#000" style={styles.icon} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//             >
//               <Icon
//                 name="more-vert"
//                 size={22}
//                 color="#000"
//                 style={styles.icon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Info */}
//         <View style={styles.storeInfo}>
//           {!!deal.title && <Text style={styles.storeTitle}>{deal.title}</Text>}
//           {!!deal.description && (
//             <Text style={styles.description}>{deal.description}</Text>
//           )}
//           {(deal.validFrom || deal.validTo) && (
//             <Text style={styles.dateRange}>
//               Valid: {deal.validFrom || '—'} to {deal.validTo || '—'}
//             </Text>
//           )}
//         </View>

//         {/* Content */}
//         <ScrollView
//           style={styles.flyerContent}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           contentContainerStyle={{
//             paddingBottom: MAX_HEIGHT + insets.bottom + 24, // keep above bottom sheet
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Flyer image with natural aspect ratio */}
//           {!!deal.image && (
//             <View style={styles.flyerSection}>
//               <Image
//                 source={{ uri: deal.image }}
//                 onLoad={onImageLoad}
//                 style={[
//                   styles.flyerImage,
//                   flyerAspect ? { aspectRatio: flyerAspect } : { height: 380 }, // fallback height until we know ratio
//                 ]}
//                 resizeMode="contain"
//               />
//               <Text style={styles.flyerSubText}>
//                 Explore exclusive deals and offers available for {deal.name}.
//               </Text>
//             </View>
//           )}

//           {/* QR code */}
//           <View style={styles.qrCodeContainer}>
//             {qrUri ? (
//               <>
//                 <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
//                 <Image
//                   source={{ uri: qrUri }}
//                   onLoad={onQrLoad}
//                   style={[
//                     styles.qrCodeImage,
//                     qrAspect ? { aspectRatio: qrAspect } : undefined,
//                   ]}
//                   resizeMode="contain"
//                 />
//               </>
//             ) : (
//               <Text style={styles.qrCodeTitle}>QR Code not available</Text>
//             )}
//           </View>
//         </ScrollView>

//         {/* Bottom Sheet (safe-area aware) */}
//         <Animated.View
//           {...panResponder.panHandlers}
//           style={[
//             styles.bottomSheet,
//             {
//               height: Animated.add(
//                 animatedHeight,
//                 new Animated.Value(insets.bottom),
//               ),
//               paddingBottom: insets.bottom + 12,
//             },
//           ]}
//         >
//           <View style={styles.centerLine} />
//           <View style={styles.sheetHeader}>
//             <Text style={styles.sheetTitle} numberOfLines={1}>
//               {deal.name}
//             </Text>
//           </View>
//           <View style={styles.sheetActions}>
//             <TouchableOpacity
//               onPress={handleShare}
//               style={styles.shareDealButton}
//             >
//               <Text style={styles.shareDealText}>Share Deal</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeTop: { flex: 1, backgroundColor: '#F8F8FF' },
//   container: { flex: 1, backgroundColor: '#F8F8FF' },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 14,
//   },
//   headerTitle: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   headerIcons: { flexDirection: 'row' },
//   icon: { marginLeft: 12 },

//   storeInfo: { paddingHorizontal: 15, paddingBottom: 8 },
//   storeTitle: {
//     fontSize: 18,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: { fontSize: 14, color: '#555' },
//   dateRange: { fontSize: 14, color: '#000', marginTop: 6 },

//   flyerContent: { paddingHorizontal: 12 },
//   flyerSection: { marginBottom: 18, alignItems: 'center' },

//   // Image fills width, height is derived from aspect ratio (set dynamically)
//   flyerImage: {
//     width: '100%',
//     borderRadius: 10,
//     backgroundColor: '#e8e8e8',
//   },
//   flyerSubText: {
//     color: '#000',
//     fontSize: 14,
//     marginTop: 10,
//     textAlign: 'center',
//   },

//   bottomSheet: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#293B4F',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 16,
//     paddingTop: 8,
//   },
//   centerLine: {
//     width: 40,
//     height: 5,
//     backgroundColor: '#B7C0CA',
//     borderRadius: 999,
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 14,
//   },
//   sheetTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   sheetActions: { flexDirection: 'row', justifyContent: 'space-between' },
//   shareDealButton: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#4C6EF5',
//   },
//   shareDealText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },

//   qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
//   qrCodeTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   qrCodeImage: { width: '60%', maxWidth: 260 }, // height comes from aspectRatio
// });

// export default FlyerScreen;

///////////////////////////////////////

/* eslint-disable react-native/no-inline-styles */
// import React, { useRef, useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Animated,
//   Easing,
//   PanResponder,
//   Share,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import RNFS from 'react-native-fs';
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// type Deal = {
//   name: string;
//   title?: string;
//   description?: string;
//   validFrom?: string;
//   validTo?: string;
//   image?: string; // base64 or remote URL
//   storeQrCode?: string;
//   brandQrCode?: string;
// };

// const MIN_HEIGHT = 56; // bottom sheet collapsed height
// const MAX_HEIGHT = 180; // bottom sheet expanded height

// const isBase64 = (uri?: string) => !!uri && uri.startsWith('data:image/');
// const filenameFromUrl = (url: string) =>
//   url.split('?')[0].split('/').pop() || 'image';

// const FlyerScreen = ({ route, navigation }: any) => {
//   const deal: Deal = route.params?.deal || {};
//   const insets = useSafeAreaInsets();

//   // --- bottom sheet (KEEPING YOUR IMPLEMENTATION) ---
//   const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const animateBottomSheet = (toValue: number) => {
//     Animated.timing(animatedHeight, {
//       toValue,
//       duration: 280,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: false, // height animation -> JS/layout (as requested)
//     }).start();
//   };

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const currentY = event.nativeEvent.contentOffset.y;
//     if (currentY > lastScrollY + 16) animateBottomSheet(MAX_HEIGHT);
//     else if (currentY < lastScrollY - 16) animateBottomSheet(MIN_HEIGHT);
//     setLastScrollY(currentY);
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => animatedHeight.stopAnimation(),
//       onPanResponderMove: (_evt, g) => {
//         const next = Math.max(
//           MIN_HEIGHT,
//           Math.min(MAX_HEIGHT, MAX_HEIGHT - g.dy),
//         );
//         animatedHeight.setValue(next);
//       },
//       onPanResponderRelease: (_evt, g) => {
//         if (g.dy > 40) animateBottomSheet(MIN_HEIGHT);
//         else animateBottomSheet(MAX_HEIGHT);
//       },
//     }),
//   ).current;

//   // --- image sizing (aspect ratio) + loaders/fallbacks ---
//   const [flyerAspect, setFlyerAspect] = useState<number | undefined>(undefined);
//   const [qrAspect, setQrAspect] = useState<number | undefined>(1);
//   const [imgLoading, setImgLoading] = useState<boolean>(!!deal.image);
//   const [qrLoading, setQrLoading] = useState<boolean>(
//     !!(deal.storeQrCode || deal.brandQrCode),
//   );
//   const [imgError, setImgError] = useState<boolean>(false);
//   const [qrError, setQrError] = useState<boolean>(false);

//   const onImageLoad = (e: any) => {
//     const w = e?.nativeEvent?.source?.width;
//     const h = e?.nativeEvent?.source?.height;
//     if (w && h && h !== 0) setFlyerAspect(w / h);
//     setImgLoading(false);
//   };
//   const onQrLoad = (e: any) => {
//     const w = e?.nativeEvent?.source?.width;
//     const h = e?.nativeEvent?.source?.height;
//     if (w && h && h !== 0) setQrAspect(w / h);
//     setQrLoading(false);
//   };

//   // Share: supports base64 or remote URL
//   const handleShare = async () => {
//     try {
//       let filePath: string | undefined;
//       if (deal.image) {
//         if (isBase64(deal.image)) {
//           const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
//           const ext =
//             deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
//           filePath = `${RNFS.CachesDirectoryPath}/flyer.${ext}`;
//           await RNFS.writeFile(filePath, base64Data, 'base64');
//         } else {
//           const fname = filenameFromUrl(deal.image);
//           filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
//           if (!(await RNFS.exists(filePath))) {
//             await RNFS.downloadFile({ fromUrl: deal.image, toFile: filePath })
//               .promise;
//           }
//         }
//       }

//       await Share.share({
//         message: `Check out this deal: ${deal.title || deal.name}\nValid: ${
//           deal.validFrom || ''
//         } to ${deal.validTo || ''}`,
//         url: filePath ? `file://${filePath}` : undefined,
//       });
//     } catch (err: any) {
//       console.error('Error sharing flyer:', err?.message || err);
//     }
//   };

//   const qrUri = useMemo(() => deal.storeQrCode || deal.brandQrCode, [deal]);

//   return (
//     <SafeAreaView edges={['top']} style={styles.safeTop}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//           >
//             <Icon name="arrow-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             {deal.name || 'Flyer'}
//           </Text>
//           <View style={styles.headerIcons}>
//             <TouchableOpacity
//               onPress={handleShare}
//               hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//             >
//               <Icon name="share" size={22} color="#000" style={styles.icon} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//             >
//               <Icon
//                 name="more-vert"
//                 size={22}
//                 color="#000"
//                 style={styles.icon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Info */}
//         <View style={styles.storeInfo}>
//           {!!deal.title && <Text style={styles.storeTitle}>{deal.title}</Text>}
//           {!!deal.description && (
//             <Text style={styles.description}>{deal.description}</Text>
//           )}
//           {(deal.validFrom || deal.validTo) && (
//             <Text style={styles.dateRange}>
//               Valid: {deal.validFrom || '—'} to {deal.validTo || '—'}
//             </Text>
//           )}
//         </View>

//         {/* Content */}
//         <ScrollView
//           style={styles.flyerContent}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           contentContainerStyle={{
//             paddingBottom: MAX_HEIGHT + insets.bottom + 24, // ensure not hidden under sheet
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Flyer image */}
//           {!!deal.image && (
//             <View style={styles.flyerSection}>
//               <View style={styles.imageWrap}>
//                 {imgLoading && (
//                   <ActivityIndicator
//                     size="small"
//                     color="#4C6EF5"
//                     style={styles.loader}
//                   />
//                 )}
//                 {!imgError ? (
//                   <Image
//                     source={{ uri: deal.image }}
//                     onLoad={onImageLoad}
//                     onError={() => {
//                       setImgError(true);
//                       setImgLoading(false);
//                     }}
//                     style={[
//                       styles.flyerImage,
//                       flyerAspect
//                         ? { aspectRatio: flyerAspect }
//                         : { height: 380 },
//                     ]}
//                     resizeMode="contain"
//                     accessible
//                     accessibilityLabel="Flyer image"
//                   />
//                 ) : (
//                   <View
//                     style={[
//                       styles.flyerImage,
//                       {
//                         height: 220,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       },
//                     ]}
//                   >
//                     <Text style={{ color: '#666' }}>Image not available</Text>
//                   </View>
//                 )}
//               </View>

//               <Text style={styles.flyerSubText}>
//                 Explore exclusive deals and offers available for {deal.name}.
//               </Text>
//             </View>
//           )}

//           {/* QR code */}
//           <View style={styles.qrCodeContainer}>
//             {qrUri ? (
//               <>
//                 <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
//                 <View style={styles.qrWrap}>
//                   {qrLoading && (
//                     <ActivityIndicator
//                       size="small"
//                       color="#4C6EF5"
//                       style={styles.loader}
//                     />
//                   )}
//                   {!qrError ? (
//                     <Image
//                       source={{ uri: qrUri }}
//                       onLoad={onQrLoad}
//                       onError={() => {
//                         setQrError(true);
//                         setQrLoading(false);
//                       }}
//                       style={[
//                         styles.qrCodeImage,
//                         qrAspect ? { aspectRatio: qrAspect } : undefined,
//                       ]}
//                       resizeMode="contain"
//                       accessible
//                       accessibilityLabel="QR code"
//                     />
//                   ) : (
//                     <View
//                       style={[
//                         styles.qrCodeImage,
//                         { alignItems: 'center', justifyContent: 'center' },
//                       ]}
//                     >
//                       <Text style={{ color: '#666' }}>QR not available</Text>
//                     </View>
//                   )}
//                 </View>
//               </>
//             ) : (
//               <Text style={styles.qrCodeTitle}>QR Code not available</Text>
//             )}
//           </View>
//         </ScrollView>

//         {/* Bottom Sheet (unchanged behavior, just safe-area padding) */}
//         <Animated.View
//           {...panResponder.panHandlers}
//           style={[
//             styles.bottomSheet,
//             {
//               height: Animated.add(
//                 animatedHeight,
//                 new Animated.Value(insets.bottom),
//               ),
//               paddingBottom: insets.bottom + 12,
//             },
//           ]}
//         >
//           <View style={styles.centerLine} />
//           <View style={styles.sheetHeader}>
//             <Text style={styles.sheetTitle} numberOfLines={1}>
//               {deal.name || 'Flyer'}
//             </Text>
//           </View>
//           <View style={styles.sheetActions}>
//             <TouchableOpacity
//               onPress={handleShare}
//               style={styles.shareDealButton}
//               activeOpacity={0.9}
//             >
//               <Text style={styles.shareDealText}>Share Deal</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeTop: { flex: 1, backgroundColor: '#F8F8FF' },
//   container: { flex: 1, backgroundColor: '#F8F8FF' },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 14,
//   },
//   headerTitle: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   headerIcons: { flexDirection: 'row' },
//   icon: { marginLeft: 12 },

//   storeInfo: { paddingHorizontal: 15, paddingBottom: 8 },
//   storeTitle: {
//     fontSize: 18,
//     color: '#000',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   description: { fontSize: 14, color: '#555' },
//   dateRange: { fontSize: 14, color: '#000', marginTop: 6 },

//   flyerContent: { paddingHorizontal: 12 },
//   flyerSection: { marginBottom: 18, alignItems: 'center' },

//   imageWrap: { width: '100%', position: 'relative' },
//   loader: { position: 'absolute', top: 10, right: 10, zIndex: 1 },

//   flyerImage: {
//     width: '100%',
//     borderRadius: 10,
//     backgroundColor: '#e8e8e8',
//   },
//   flyerSubText: {
//     color: '#000',
//     fontSize: 14,
//     marginTop: 10,
//     textAlign: 'center',
//   },

//   bottomSheet: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#293B4F',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.18,
//         shadowRadius: 12,
//         shadowOffset: { width: 0, height: -6 },
//       },
//       android: { elevation: 12 },
//     }),
//   },
//   centerLine: {
//     width: 40,
//     height: 5,
//     backgroundColor: '#B7C0CA',
//     borderRadius: 999,
//     alignSelf: 'center',
//     marginBottom: 10,
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 14,
//   },
//   sheetTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   sheetActions: { flexDirection: 'row', justifyContent: 'space-between' },
//   shareDealButton: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#4C6EF5',
//   },
//   shareDealText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },

//   qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
//   qrCodeTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   qrWrap: { width: '60%', maxWidth: 260, alignItems: 'center' },
//   qrCodeImage: { width: '100%' }, // height from aspectRatio
// });

// export default FlyerScreen;

//////////////////////////////////////////////////

/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useRef, useState } from 'react';
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
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Deal = {
  name: string;
  title?: string;
  description?: string;
  validFrom?: string; // e.g. "2025-09-09" or ISO
  validTo?: string; // e.g. "2025-09-20" or ISO
  image?: string; // base64 or remote URL
  storeQrCode?: string;
  brandQrCode?: string;
};

/* -------------------- Config -------------------- */
const MIN_HEIGHT = 56; // bottom sheet collapsed height (KEEPING YOUR BEHAVIOR)
const MAX_HEIGHT = 180; // bottom sheet expanded height

/* -------------------- Utils -------------------- */
const isBase64 = (uri?: string) => !!uri && uri.startsWith('data:image/');
const filenameFromUrl = (url: string) =>
  url.split('?')[0].split('/').pop() || 'image';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const parseToDate = (v?: string): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, da] = m;
    const dd = new Date(Number(y), Number(mo) - 1, Number(da));
    return isNaN(dd.getTime()) ? null : dd;
  }
  return null;
};

const fmtFull = (d: Date) =>
  `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

/** Condensed range:
 *  Sep 9–20, 2025 | Sep 28 – Oct 3, 2025 | Sep 9, 2025 – Jan 4, 2026
 */
const formatRangeCondensed = (from?: string, to?: string): string => {
  const s = parseToDate(from);
  const e = parseToDate(to);
  if (!s && !e) return '—';
  if (s && !e) return fmtFull(s);
  if (!s && e) return fmtFull(e);

  if (s!.getFullYear() === e!.getFullYear()) {
    const y = s!.getFullYear();
    if (s!.getMonth() === e!.getMonth()) {
      return `${MONTHS[s!.getMonth()]} ${s!.getDate()}–${e!.getDate()}, ${y}`;
    }
    return `${MONTHS[s!.getMonth()]} ${s!.getDate()} – ${
      MONTHS[e!.getMonth()]
    } ${e!.getDate()}, ${y}`;
  }
  return `${fmtFull(s!)} – ${fmtFull(e!)}`;
};

type ValidMeta = {
  rangeLabel: string;
  status: 'active' | 'upcoming' | 'expired';
  statusLabel: string;
};

const computeValidity = (from?: string, to?: string): ValidMeta | null => {
  const start = parseToDate(from);
  const end = parseToDate(to);
  if (!start && !end) return null;

  const now = new Date();
  const endOfDay = end
    ? new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999,
      )
    : null;

  let status: ValidMeta['status'];
  let statusLabel = '';

  if ((!start || start <= now) && (!end || now <= (endOfDay as Date))) {
    status = 'active';
    statusLabel = `Active · ends ${end ? fmtFull(end) : '—'}`;
  } else if (start && now < start) {
    status = 'upcoming';
    statusLabel = `Starts ${fmtFull(start)}`;
  } else {
    status = 'expired';
    statusLabel = `Expired ${end ? fmtFull(end) : '—'}`;
  }

  return { rangeLabel: formatRangeCondensed(from, to), status, statusLabel };
};

/* -------------------- Screen -------------------- */
const FlyerScreen = ({ route, navigation }: any) => {
  const deal: Deal = route.params?.deal || {};
  const insets = useSafeAreaInsets();

  /** Bottom sheet (unchanged; uses height animation) */
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const [lastScrollY, setLastScrollY] = useState(0);

  const animateBottomSheet = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // height animation as requested
    }).start();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY + 16) animateBottomSheet(MAX_HEIGHT);
    else if (currentY < lastScrollY - 16) animateBottomSheet(MIN_HEIGHT);
    setLastScrollY(currentY);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => animatedHeight.stopAnimation(),
      onPanResponderMove: (_evt, g) => {
        const next = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, MAX_HEIGHT - g.dy),
        );
        animatedHeight.setValue(next);
      },
      onPanResponderRelease: (_evt, g) => {
        if (g.dy > 40) animateBottomSheet(MIN_HEIGHT);
        else animateBottomSheet(MAX_HEIGHT);
      },
    }),
  ).current;

  /** Image/QR aspect + loaders/fallbacks */
  const [flyerAspect, setFlyerAspect] = useState<number | undefined>(undefined);
  const [qrAspect, setQrAspect] = useState<number | undefined>(1);
  const [imgLoading, setImgLoading] = useState<boolean>(!!deal.image);
  const [qrLoading, setQrLoading] = useState<boolean>(
    !!(deal.storeQrCode || deal.brandQrCode),
  );
  const [imgError, setImgError] = useState<boolean>(false);
  const [qrError, setQrError] = useState<boolean>(false);

  const onImageLoad = (e: any) => {
    const w = e?.nativeEvent?.source?.width;
    const h = e?.nativeEvent?.source?.height;
    if (w && h) setFlyerAspect(w / h);
    setImgLoading(false);
  };
  const onQrLoad = (e: any) => {
    const w = e?.nativeEvent?.source?.width;
    const h = e?.nativeEvent?.source?.height;
    if (w && h) setQrAspect(w / h);
    setQrLoading(false);
  };

  /** Share (base64 or remote) */
  // const handleShare = async () => {
  //   try {
  //     let filePath: string | undefined;
  //     if (deal.image) {
  //       if (isBase64(deal.image)) {
  //         const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
  //         const ext =
  //           deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
  //         filePath = `${RNFS.CachesDirectoryPath}/flyer.${ext}`;
  //         await RNFS.writeFile(filePath, base64Data, 'base64');
  //       } else {
  //         const fname = filenameFromUrl(deal.image);
  //         filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
  //         if (!(await RNFS.exists(filePath))) {
  //           await RNFS.downloadFile({ fromUrl: deal.image, toFile: filePath })
  //             .promise;
  //         }
  //       }
  //     }

  //     await Share.share({
  //       message: `Check out this deal: ${deal.title || deal.name}\nValid: ${
  //         deal.validFrom || ''
  //       } to ${deal.validTo || ''}`,
  //       url: filePath ? `file://${filePath}` : undefined,
  //     });
  //   } catch (err: any) {
  //     console.error('Error sharing flyer:', err?.message || err);
  //   }
  // };

  const handleShare = async () => {
    try {
      let filePath: string | undefined;
      if (deal.image) {
        if (isBase64(deal.image)) {
          const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
          const ext =
            deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
          filePath = `${RNFS.CachesDirectoryPath}/flyer.${ext}`;
          await RNFS.writeFile(filePath, base64Data, 'base64');
        } else {
          const fname = filenameFromUrl(deal.image);
          filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
          if (!(await RNFS.exists(filePath))) {
            await RNFS.downloadFile({ fromUrl: deal.image, toFile: filePath })
              .promise;
          }
        }
      }

      await Share.share({
        message: `Check out this deal: ${deal.title || deal.name}\nValid: ${
          deal.validFrom || ''
        } to ${
          deal.validTo || ''
        }\n\nGet the app here:\nhttps://play.google.com/store/apps/details?id=com.jspromotionalatestversion`,
        url: filePath ? `file://${filePath}` : undefined,
      });
    } catch (err: any) {
      console.error('Error sharing flyer:', err?.message || err);
    }
  };

  const qrUri = useMemo(() => deal.storeQrCode || deal.brandQrCode, [deal]);
  const validMeta = computeValidity(deal.validFrom, deal.validTo);

  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {deal.name || 'Flyer'}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={handleShare}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon name="share" size={22} color="#000" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon
                name="more-vert"
                size={22}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.storeInfo}>
          {!!deal.title && <Text style={styles.storeTitle}>{deal.title}</Text>}
          {!!deal.description && (
            <Text style={styles.description}>{deal.description}</Text>
          )}

          {/* Validity (condensed + status chip) */}
          {validMeta && (
            <View style={styles.validBlock}>
              <View style={styles.validRow}>
                <Icon name="event" size={18} color="#0B274A" />
                <Text style={styles.validRangeText}>
                  Valid: {validMeta.rangeLabel}
                </Text>
              </View>

              <View
                style={[
                  styles.statusChip,
                  validMeta.status === 'active' && styles.chipActive,
                  validMeta.status === 'upcoming' && styles.chipUpcoming,
                  validMeta.status === 'expired' && styles.chipExpired,
                ]}
              >
                <Icon
                  name={
                    validMeta.status === 'active'
                      ? 'check-circle'
                      : validMeta.status === 'upcoming'
                      ? 'schedule'
                      : 'error-outline'
                  }
                  size={14}
                  style={styles.chipIcon}
                  color={
                    validMeta.status === 'active'
                      ? '#177245'
                      : validMeta.status === 'upcoming'
                      ? '#2B5FDB'
                      : '#C1352A'
                  }
                />
                <Text
                  style={[
                    styles.chipText,
                    validMeta.status === 'active' && { color: '#0E5A36' },
                    validMeta.status === 'upcoming' && { color: '#214AB6' },
                    validMeta.status === 'expired' && { color: '#9E2E24' },
                  ]}
                  numberOfLines={1}
                >
                  {validMeta.statusLabel}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.flyerContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: MAX_HEIGHT + insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Flyer image */}
          {!!deal.image && (
            <View style={styles.flyerSection}>
              <View style={styles.imageWrap}>
                {imgLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#4C6EF5"
                    style={styles.loader}
                  />
                )}
                {!imgError ? (
                  <Image
                    source={{ uri: deal.image }}
                    onLoad={onImageLoad}
                    onError={() => {
                      setImgError(true);
                      setImgLoading(false);
                    }}
                    style={[
                      styles.flyerImage,
                      flyerAspect
                        ? { aspectRatio: flyerAspect }
                        : { height: 380 },
                    ]}
                    resizeMode="contain"
                    accessible
                    accessibilityLabel="Flyer image"
                  />
                ) : (
                  <View
                    style={[
                      styles.flyerImage,
                      {
                        height: 220,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Text style={{ color: '#666' }}>Image not available</Text>
                  </View>
                )}
              </View>

              <Text style={styles.flyerSubText}>
                Explore exclusive deals and offers available for {deal.name}.
              </Text>
            </View>
          )}

          {/* QR code */}
          <View style={styles.qrCodeContainer}>
            {qrUri ? (
              <>
                <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
                <View style={styles.qrWrap}>
                  {qrLoading && (
                    <ActivityIndicator
                      size="small"
                      color="#4C6EF5"
                      style={styles.loader}
                    />
                  )}
                  {!qrError ? (
                    <Image
                      source={{ uri: qrUri }}
                      onLoad={onQrLoad}
                      onError={() => {
                        setQrError(true);
                        setQrLoading(false);
                      }}
                      style={[
                        styles.qrCodeImage,
                        qrAspect ? { aspectRatio: qrAspect } : undefined,
                      ]}
                      resizeMode="contain"
                      accessible
                      accessibilityLabel="QR code"
                    />
                  ) : (
                    <View
                      style={[
                        styles.qrCodeImage,
                        { alignItems: 'center', justifyContent: 'center' },
                      ]}
                    >
                      <Text style={{ color: '#666' }}>QR not available</Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.qrCodeTitle}>QR Code not available</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sheet (unchanged logic) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bottomSheet,
            {
              height: Animated.add(
                animatedHeight,
                new Animated.Value(insets.bottom),
              ),
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <View style={styles.centerLine} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {deal.name || 'Flyer'}
            </Text>
          </View>
          <View style={styles.sheetActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.shareDealButton}
              activeOpacity={0.9}
            >
              <Text style={styles.shareDealText}>Share Deal</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  safeTop: { flex: 1, backgroundColor: '#F8F8FF' },
  container: { flex: 1, backgroundColor: '#F8F8FF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 12 },

  storeInfo: { paddingHorizontal: 15, paddingBottom: 8 },
  storeTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: { fontSize: 14, color: '#555' },

  /* Validity UI */
  validBlock: { marginTop: 8 },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  validRangeText: { color: '#0B2239', fontSize: 14, fontWeight: '600' },
  statusChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#F4F6FA',
    borderColor: '#D8E0ED',
  },
  chipIcon: { marginRight: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipActive: { backgroundColor: '#E9F7EF', borderColor: '#CFEBDC' },
  chipUpcoming: { backgroundColor: '#EEF3FF', borderColor: '#D8E2FF' },
  chipExpired: { backgroundColor: '#FFEDEE', borderColor: '#F9D2D5' },

  flyerContent: { paddingHorizontal: 12 },
  flyerSection: { marginBottom: 18, alignItems: 'center' },

  imageWrap: { width: '100%', position: 'relative' },
  loader: { position: 'absolute', top: 10, right: 10, zIndex: 1 },

  flyerImage: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8e8e8',
  },
  flyerSubText: {
    color: '#000',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },

  qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
  qrCodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  qrWrap: { width: '60%', maxWidth: 260, alignItems: 'center' },
  qrCodeImage: { width: '100%' }, // height from aspectRatio

  /* Bottom sheet (logic unchanged) */
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#293B4F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -6 },
      },
      android: { elevation: 12 },
    }),
  },
  centerLine: {
    width: 40,
    height: 5,
    backgroundColor: '#B7C0CA',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sheetActions: { flexDirection: 'row', justifyContent: 'space-between' },
  shareDealButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C6EF5',
  },
  shareDealText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },
});

export default FlyerScreen;
