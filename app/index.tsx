import Button from '@/components/atomic/Button';
import IconButton from '@/components/atomic/IconButton';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/store/user';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';

import Toast from 'react-native-toast-message';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LoginUserResponse } from '@/api';

const AuthPage = () => {
  const [authState, setAuthState] = useState<'signup' | 'login'>('login');
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [ghRepoName, setGhRepoName] = useState('');
  const [ghPat, setGhPat] = useState('');

  const [checkGithub, setCheckGithub] = useState(false);

  const { user, login, signUp, logout } = useUser();

  const router = useRouter();

  const disableLogin = authState === 'login' && !user && (username.length < 3 || passkey.length < 4);
  const disableSignUp = authState === 'signup' && !user && ((username.length < 3 || passkey.length < 4) || (checkGithub && (ghRepoName.length < 3 || ghPat.length < 3)));

  const clearInputs = () => {
    setUsername('');
    setPasskey('');
    setGhPat('');
    setGhRepoName('');
  }

  const handleAuthClick = async () => {
    switch (authState) {
      case 'login':
        handleLogin()
        break;

      case 'signup':
        handleSignUp()
        break;

      default:
        break;
    }
  }

  const handleLogin = async () => {

    if (disableLogin) {
      return;
    }

    try {
      await login(username, Number(passkey));
      clearInputs();
      takeMeHome();

    } catch (err: any) {
      console.log('Error while logging in AuthPage', err);

      Toast.show({
        text1Style: {fontSize: 18, fontFamily: 'Rubik400'},
        swipeable: true,
        type: 'error',
        text1: err.message as string ?? 'Something went wrong!'
      });
    }
  };


  const switchAuthState = () => {
    setAuthState(prev => prev === 'login' ? 'signup' : 'login')
  }


  const handleSignUp = async () => {

    if (disableSignUp) {
      return;
    }

    try {
      await signUp({ username, passkey: Number(passkey) }, { ghRepoName, ghPat });
      clearInputs();
      takeMeHome();

    } catch (err: any) {
      console.log('Error while signing in AuthPage', err);

      Toast.show({
        text1Style: {fontSize: 18, fontFamily: 'Rubik400'},
        swipeable: true,
        type: 'error',
        text1: err.message as string ?? 'Something went wrong!'
      });
    }
  };


  const takeMeHome = () => {
    router.push('/home');
  };

  const renderInputFields = () => (
    <>
      {!user && (
        <View>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={ checkGithub ? "GitHub Username" : "Username" }
            placeholderTextColor={Colors.light.placeholder}
          />
          <TextInput
            style={styles.input}
            value={passkey}
            onChangeText={setPasskey}
            placeholder="Pass Key"
            maxLength={4}
            keyboardType='numeric'
            secureTextEntry={true}
            placeholderTextColor={Colors.light.placeholder}
          />
        </View>
      )}
      {
        authState === 'signup' && checkGithub ?
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
          <Text style={styles.logo}>
            entangled
            <Entypo name="link" size={40} color={Colors.light.text} />
          </Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Username: <Text style={styles.labelItem}>{user?.username ?? ''}</Text></Text>
            <Text style={styles.label}>Collaborator ID: <Text style={styles.labelItem}>{user?.userID ?? ''}</Text></Text>
          </View>

          <View style={styles.buttonsContainer}>
            {
              user ?
                <View style={styles.loggedInButtons}>
                  <Button text="LOGOUT" onButtonPress={logout} type='secondary' />
                </View> :
                null
            }
            <IconButton
              onPressHandle={takeMeHome}
              disabled={disableLogin}
              size={65}
            >
              <AntDesign name="right" size={24} color="black" />
            </IconButton>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.logo}>
            entangled
            <Entypo name="link" size={40} color={Colors.light.text} />
          </Text>
          {renderInputFields()}
          <View
            style={styles.loginContainer}
          >
            {
              authState === 'signup' &&
              <BouncyCheckbox
                size={25}
                fillColor={Colors.light.subtleBackground}
                unFillColor={Colors.light.background}
                text="Connect to GitHub"
                iconStyle={{ borderColor: Colors.light.text }}
                style={{ marginBottom: 20 }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ fontFamily: "Rubik500", textDecorationLine: "none", fontSize: 20 }}
                isChecked={checkGithub}
                onPress={(isChecked: boolean) => { setCheckGithub(isChecked) }}
              />
            }
            <View style={styles.authSwitcher}>
              <Pressable onPress={switchAuthState}>
                <Text style={styles.authLabel}>
                  <Text style={styles.authText}>
                    {authState === 'login' ? 'New user?' : 'Already a user?'}
                  </Text>
                  &nbsp;&nbsp;
                  {authState === 'login' ? 'SIGN UP' : 'LOGIN'}
                </Text>
              </Pressable>
              <IconButton
                onPressHandle={handleAuthClick}
                disabled={disableLogin || disableSignUp}
                size={65}
              >
                <AntDesign name="right" size={24} color="black" />
              </IconButton>
            </View>
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
  },
  logo: {
    fontFamily: 'Rubik600',
    fontSize: 40,
    alignSelf: 'center',
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelItem: {
    fontSize: 26,
    fontFamily: 'Rubik500'
  },
  authSwitcher: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  authLabel: {
    fontSize: 22,
    fontFamily: 'Rubik500'
  },
  authText: {
    fontSize: 18,
    fontFamily: 'Rubik400',
  }
});

export default AuthPage;