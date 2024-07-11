import Button from '@/components/atomic/Button';
import IconButton from '@/components/atomic/IconButton';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/store/user';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const YourComponent = () => {
  const [username, setUsername] = useState('');
  const [ghRepoName, setGhRepoName] = useState('');
  const [ghPat, setGhPat] = useState('');

  const [checkGithub, setCheckGithub] = useState(false);

  const { user, login, updateUser, logout } = useUser();

  const router = useRouter();

  const toLogin = username.length < 3 && (checkGithub && (ghRepoName.length > 3 && ghPat.length > 3))

  const handleLogin = () => {

    if (toLogin) {
      return;
    }

    login(username, ghRepoName, ghPat);

    takeMeHome();
  };

  const takeMeHome = () => {
    router.push('/home');
  };

  const handleUpdateDetails = () => {
    updateUser(ghRepoName, ghPat);
  };

  const renderInputFields = () => (
    <>
      {!user && (
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={Colors.light.placeholder}
        />
      )}
      {
        checkGithub || user ?
          <Animated.View entering={FadeIn}>
            <View>
              <TextInput
                style={styles.input}
                value={ghRepoName}
                onChangeText={setGhRepoName}
                placeholder="GitHub Repo Name"
                placeholderTextColor={Colors.light.placeholder}
              />
              <TextInput
                style={styles.input}
                value={ghPat}
                onChangeText={setGhPat}
                placeholder="GitHub PAT"
                placeholderTextColor={Colors.light.placeholder}
              />
            </View>
          </Animated.View>
          :
          null
      }
    </>
  );

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Username: {user?.username ?? ''}</Text>
            <Text style={styles.label}>Collaborator ID: {user?.userID ?? ''}</Text>
          </View>
          {renderInputFields()}
          <View style={styles.buttonsContainer}>
            {
              user ?
                <View style={styles.loggedInButtons}>
                  <Button text="UPDATE GIT" onButtonPress={handleUpdateDetails} type='secondary' />
                  <Button text="LOGOUT" onButtonPress={logout} />
                </View> :
                null
            }
            <IconButton
              onPressHandle={takeMeHome}
              disabled={toLogin}
              size={65}
            >
              <AntDesign name="right" size={24} color="black" />
            </IconButton>
          </View>
        </View>
      ) : (
        <View>
          {renderInputFields()}
          <View
            style={styles.loginContainer}
          >
            <BouncyCheckbox
              size={25}
              fillColor={Colors.light.subtleBackground}
              unFillColor={Colors.light.background}
              text="Connect to GitHub"
              iconStyle={{ borderColor: Colors.light.text }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ fontFamily: "Rubik500", textDecorationLine: "none", fontSize: 20 }}
              onPress={(isChecked: boolean) => { setCheckGithub(isChecked) }}
            />
            <IconButton
              onPressHandle={handleLogin}
              disabled={toLogin}
              size={65}
            >
              <AntDesign name="right" size={24} color="black" />
            </IconButton>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'Rubik400',
    marginVertical: 4,
  },
  input: {
    height: 60,
    borderColor: Colors.light.subtleBackground,
    borderWidth: 1,
    fontSize: 20,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginVertical: 8,
    color: Colors.light.text,
    fontFamily: 'Rubik500',
  },
  labelContainer: {
    marginBottom: 20
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  loggedInButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  }
});

export default YourComponent;