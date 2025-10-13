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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { formatDate } from '../../components/store-flyers';

type SpecialEvent = {
  id: string;
  name: string;
  description: string;
  brandId?: string;
  storeId?: string;
  image: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  brand?: Record<string, any>;
  store?: Record<string, any>;
};

/* -------------------- Config -------------------- */
const MIN_HEIGHT = 56;
const MAX_HEIGHT = 120;

/* -------------------- Utils -------------------- */
const computeValidity = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return {
      status: 'upcoming' as const,
      label: `Starts ${formatDate(startDate)}`,
      icon: 'schedule',
      color: '#2563EB',
    };
  } else if (now > end) {
    return {
      status: 'expired' as const,
      label: `Expired ${formatDate(endDate)}`,
      icon: 'event-busy',
      color: '#DC2626',
    };
  } else {
    return {
      status: 'active' as const,
      label: 'Active Now',
      icon: 'event-available',
      color: '#16A34A',
    };
  }
};

/* -------------------- Screen -------------------- */
const SpecialEventDetailScreen = ({ route, navigation }: any) => {
  const event: SpecialEvent = route.params?.event || {};
  const insets = useSafeAreaInsets();

  // Check if we have valid event data
  if (!event.id) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Event Not Found
            </Text>
            <View style={styles.headerIcons} />
          </View>
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={64} color="#ccc" />
            <Text style={styles.errorText}>Event data not available</Text>
            <Text style={styles.errorSubText}>
              The event you're looking for could not be loaded.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /** Bottom sheet animation */
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const [lastScrollY, setLastScrollY] = useState(0);

  const animateBottomSheet = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
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

  /** Image loading states */
  const [imageAspect, setImageAspect] = useState<number | undefined>(undefined);
  const [imgLoading, setImgLoading] = useState<boolean>(!!event.image);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    setImageAspect(width / height);
    setImgLoading(false);
    setImgError(false);
  };

  const handleImageError = () => {
    setImgLoading(false);
    setImgError(true);
    console.log('Image failed to load:', event.image);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this special event: ${event.name}`,
        title: event.name,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const validMeta = computeValidity(event.startDate, event.endDate);

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
            {event.name}
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

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.name}</Text>

          {/* Brand/Store Info */}
          {(event.brand?.name || event.store?.name) && (
            <View style={styles.brandInfo}>
              <Text style={styles.brandLabel}>
                {event.store?.name ? 'Store' : 'Brand'}:
              </Text>
              <Text style={styles.brandName}>
                {event.store?.name || event.brand?.name}
              </Text>
            </View>
          )}

          {/* Store Address if available */}
          {event.store?.address && (
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Address:</Text>
              <Text style={styles.addressText}>{event.store.address}</Text>
            </View>
          )}

          {/* Description */}
          {event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}

          {/* Validity Status */}
          <View style={styles.validBlock}>
            <View style={styles.validRow}>
              <Text style={styles.validRangeText}>
                Valid: {formatDate(event.startDate)} -{' '}
                {formatDate(event.endDate)}
              </Text>
            </View>
            <View
              style={[
                styles.statusChip,
                styles[
                  `chip${
                    validMeta.status.charAt(0).toUpperCase() +
                    validMeta.status.slice(1)
                  }`
                ],
              ]}
            >
              <Icon
                name={validMeta.icon}
                size={14}
                color={validMeta.color}
                style={styles.chipIcon}
              />
              <Text style={[styles.chipText, { color: validMeta.color }]}>
                {validMeta.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Event Image */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eventContent}>
            <View style={styles.imageSection}>
              <View style={styles.imageWrap}>
                {imgLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#4C6EF5"
                    style={styles.loader}
                  />
                )}

                {event.image && !imgError ? (
                  <Image
                    source={{ uri: event.image }}
                    style={[
                      styles.eventImage,
                      imageAspect && { aspectRatio: imageAspect },
                    ]}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon name="event" size={48} color="#ccc" />
                    <Text style={styles.placeholderText}>Loading Image...</Text>
                  </View>
                )}
              </View>

              {/* Additional event details can be shown here */}
              {event.brand?.description && (
                <Text style={styles.imageSubText}>
                  {event.brand.description}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
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
              {event.name}
            </Text>
          </View>
          <View style={styles.sheetActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.shareEventButton}
              activeOpacity={0.9}
            >
              <Text style={styles.shareEventText}>Share Event</Text>
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

  eventInfo: { paddingHorizontal: 15, paddingBottom: 8 },
  eventTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },

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

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 200 },
  eventContent: { paddingHorizontal: 12 },
  imageSection: { marginBottom: 18, alignItems: 'center' },

  imageWrap: { width: '100%', position: 'relative' },
  loader: { position: 'absolute', top: 10, right: 10, zIndex: 1 },

  eventImage: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8e8e8',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  imageSubText: {
    color: '#000',
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
  shareEventButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C6EF5',
  },
  shareEventText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SpecialEventDetailScreen;
