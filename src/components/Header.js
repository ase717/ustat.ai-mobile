import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Badge, Menu, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import colors from '../theme/colors';

const Header = ({ title, showBackButton = false, showMenu = true }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    closeMenu();
    dispatch(logout());
  };

  return (
    <Appbar.Header style={styles.header}>
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.common.white} />
      )}
      
      <Appbar.Content title={title} titleStyle={styles.title} />
      
      {showMenu && (
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.common.white} />
            <Badge visible={true} size={8} style={styles.badge} />
          </TouchableOpacity>
          
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu} style={styles.avatarContainer}>
                {user?.profilePic ? (
                  <Avatar.Image size={32} source={{ uri: user.profilePic }} />
                ) : (
                  <Avatar.Text size={32} label={user?.name?.charAt(0) || 'U'} />
                )}
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => {
              closeMenu();
              navigation.navigate('Profile');
            }} title="Profilim" />
            <Menu.Item onPress={() => {
              closeMenu();
              navigation.navigate('Settings');
            }} title="Ayarlar" />
            <Menu.Item onPress={handleLogout} title="Çıkış Yap" />
          </Menu>
        </View>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary.main,
    elevation: 4,
  },
  title: {
    color: colors.common.white,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error.main,
  },
  avatarContainer: {
    marginRight: 8,
  },
});

export default Header;