import Button from '@/components/atomic/Button';
import IconButton from '@/components/atomic/IconButton';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/store/user';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ToastAndroid, ActivityIndicator } from 'react-native';

import * as Clipboard from 'expo-clipboard';

import { FontAwesome5 } from '@expo/vector-icons';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Animated, { FadeIn } from 'react-native-reanimated';

const AuthPage = () => {
  const [authState, setAuthState] = useState<'signup' | 'login'>('login');
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [ghRepoName, setGhRepoName] = useState('');
  const [ghPat, setGhPat] = useState('');

  const [checkGithub, setCheckGithub] = useState(false);

  const { user, login, signUp, logout, loading, error } = useUser();

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

      ToastAndroid.show(err.message as string ?? 'Something went wrong!', ToastAndroid.SHORT);
    }
  };


  const switchAuthState = () => {
    setAuthState(prev => prev === 'login' ? 'signup' : 'login')
  }


  const copyToCollabIDClipboard = async () => {
    await Clipboard.setStringAsync(user?.userID as string);
  };


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

      ToastAndroid.show(err.message as string ?? 'Something went wrong!', ToastAndroid.SHORT);
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
            placeholder={checkGithub ? "GitHub Username" : "Username"}
            placeholderTextColor={Colors.light.placeholder}
          />
          <TextInput
            style={styles.input}
            value={passkey}
            onChangeText={setPasskey}
            placeholder="Pass Key"
            maxLength={4}
            inputMode='numeric'
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


  const renderActions = () => {
    return (
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
            {
              loading ?
                <ActivityIndicator size="small" color={Colors.light.text} /> :
                <AntDesign name="right" size={24} color={Colors.light.text} />
            }
          </IconButton>
        </View>
      </View>
    )
  }

  const renderLoggedInActions = () => {
    return (
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
          <AntDesign name="right" size={24} color={Colors.light.text} />
        </IconButton>
      </View>
    )
  }

  const renderLogo = () => {
    return (
      <Text style={styles.logo}>
        entangled
        <Entypo name="link" size={40} color={Colors.light.text} />
      </Text>
    )
  }

  const renderUserDeetsUI = () => {
    return (
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Username: <Text style={styles.labelItem}>{user?.username ?? ''}</Text></Text>
        <Text style={styles.label}>Collaborator ID: <Text style={styles.labelItem}>{user?.userID ?? ''}</Text>
          &nbsp;&nbsp;<FontAwesome5 name="copy" size={26} color={Colors.light.text} onPress={copyToCollabIDClipboard} />
        </Text>
      </View>
    )
  }

  const renderAuthState = () => {
    return (
      <View style={styles.authStateContainer}>
        <Text style={styles.authStateText}>
          { authState === 'login' ? "LOGIN" : "SIGN UP" }
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderLogo()}
      {!user && renderAuthState()}
      {user ? (
        <View>
          {renderUserDeetsUI()}
          {renderLoggedInActions()}
        </View>
      ) : (
        <View>
          {renderInputFields()}
          {renderActions()}
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
    fontSize: 45,
    alignSelf: 'center',
    marginBottom: 60,
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
  },
  authStateContainer: {
    marginBottom: 30,
  },
  authStateText: {
    fontSize: 35,
    fontFamily: 'Rubik500',
    textAlign: 'center'
  }
});

export default AuthPage;