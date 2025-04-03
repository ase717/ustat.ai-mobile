import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const PackageCard = ({ 
  title, 
  description, 
  price, 
  features, 
  popular = false, 
  onPress 
}) => {
  return (
    <Card style={[styles.card, popular && styles.popularCard]}>
      {popular && (
        <Chip style={styles.popularChip} textStyle={styles.popularChipText}>
          En Popüler
        </Chip>
      )}
      
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <Paragraph style={styles.description}>{description}</Paragraph>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.priceSubtext}>/ay</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={18} 
                color={colors.success.main} 
                style={styles.featureIcon} 
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <Button 
          mode={popular ? "contained" : "outlined"} 
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={onPress}
        >
          Satın Al
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  popularCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  popularChip: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: colors.primary.main,
    zIndex: 1,
  },
  popularChipText: {
    color: colors.common.white,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  description: {
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  priceSubtext: {
    fontSize: 14,
    marginLeft: 2,
    marginBottom: 4,
    color: colors.text.secondary,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    flex: 1,
  },
  actions: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  button: {
    width: '90%',
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
});

export default PackageCard;