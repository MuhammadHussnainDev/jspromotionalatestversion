import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {
  CouponGift,
  fetchAllCouponGifts,
} from '../../actions/coupon-gifts/fetch-coupon';
import {formatDate} from './store-flyers';

export const GiftCardsComponent = () => {
  const [giftCards, setGiftCards] = useState<CouponGift[]>([]);
  const [loadingGiftCards, setLoadingGiftCards] = useState(true);

  // Fetch coupon gifts
  useEffect(() => {
    const loadGiftCards = async () => {
      try {
        const coupons = await fetchAllCouponGifts();
        setGiftCards(coupons);
      } catch (error) {
        console.error('Error fetching gift cards:', error);
      } finally {
        setLoadingGiftCards(false);
      }
    };

    loadGiftCards();
  }, []);

  return loadingGiftCards ? (
    <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
  ) : (
    <FlatList
      data={giftCards}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.dealCard}>
          {/* Render the image */}
          {/* <Image
            source={{uri: item.image}}
            style={styles.cardImage}
            resizeMode="cover"
          /> */}
          <View style={styles.cardDetails}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.validity}>
              Valid From: {formatDate(item.startDate)} To:{' '}
              {formatDate(item.endDate)}
            </Text>
            <Text style={styles.discount}>Discount: {item.discount}%</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No gift cards found</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  dealCard: {
    margin: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    overflow: 'hidden', // Ensure the image doesn't overflow the card
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150, // Adjust height as needed
  },
  cardDetails: {
    padding: 10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  validity: {
    fontSize: 14,
    color: '#555',
  },
  discount: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});
