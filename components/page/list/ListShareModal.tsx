import { Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';

import Modal from 'react-native-modal';
import Button from '@/components/atomic/Button';
import { Colors } from '@/constants/Colors';
import { useShares } from '@/store/share';
import { useReplicache } from '@/context/ReplicacheContext';
import uuid from 'react-native-uuid';

import ListItemAnimation from '@/components/custom/ListItemAnimation';
import { Share } from '@/entities';

type Props = {
  isVisible: boolean;
  listID: string;
  handleClose: () => void
}

const ListShareModal = ({ isVisible, listID, handleClose }: Props) => {

  const [collaboratorID, setCollaboratorID] = useState('');
  const [itemToAnimate, setItemToAnimate] = useState<string | null>(null);

  const { replicache } = useReplicache();

  const { shares, shareAdaptors } = useShares(replicache, listID);

  const handleCollaboratorInput = (text: string) => {
    setCollaboratorID(text);
  }

  const closeSharePopup = () => {
    handleClose();
    setCollaboratorID('');
  }

  const handleSubmit = async () => {

    if (collaboratorID.length < 6) {
      return;
    }

    try {
      const shareID = uuid.v4() as string;
      
      setItemToAnimate(shareID);

      await shareAdaptors.createShare({
        listID,
        userID: collaboratorID,
        id: shareID
      });

      setCollaboratorID('');
    } catch (err) {
      console.log('Error while creating share', err)
    }
  }

  const handleDeleteShare = async (shareID: string) => {
    try {
      await shareAdaptors.deleteShare(shareID);
    } catch (err) {
      console.log('Error while deleting share', err)
    }
  }

  const renderShareItem = ({ item }: {item: Share}) => (
    <ListItemAnimation
      key={item.id}
      isVisible={item.id === itemToAnimate}
    >
      <View style={styles.shareRow}>
        <View>
          <Text style={styles.shareText}>
            {item.userID}
          </Text>
        </View>
        <Pressable
          onPress={() => handleDeleteShare(item.id)}
        >
          <Ionicons name="person-remove-outline" size={24} color="black" />
        </Pressable>
      </View>
    </ListItemAnimation>
  )

  return (
    <View>
      <Modal
        isVisible={isVisible}
        avoidKeyboard={true}
        onBackButtonPress={closeSharePopup}
        onBackdropPress={closeSharePopup}
        useNativeDriver
        style={{
          margin: 0,
        }}
      >
        <View style={styles.addSharePopup}>
          {shares.length > 0 && (
            <FlatList
              data={shares}
              keyExtractor={(item) => item.id}
              renderItem={renderShareItem}
              contentContainerStyle={styles.shareRowContainer}
            />
          )}
          <View style={styles.shareForm}>
            <TextInput
              editable
              value={collaboratorID}
              onChangeText={handleCollaboratorInput}
              onSubmitEditing={handleSubmit}
              style={styles.shareTitleInput}
              placeholder="Add a collaborator"
              placeholderTextColor={Colors.light.placeholder}
              autoFocus
            />
          </View>
          <Button
            text="ADD"
            ripple
            onButtonPress={handleSubmit}
            disabled={collaboratorID.length < 6}
          />
        </View>
      </Modal>
    </View>
  )
}

export default ListShareModal

const styles = StyleSheet.create({
  shareTitleInput: {
    fontSize: 28,
    fontFamily: 'Rubik500',
    color: Colors.light.text,
    minWidth: '100%',
    marginBottom: 30
  },
  shareForm: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
    width: '100%',
  },
  addSharePopup: {
    backgroundColor: Colors.light.background,
    width: '100%',
    height: 'auto',
    maxHeight: '80%',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'flex-end'
  },
  shareRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100%',
    marginVertical: 5,
    padding: 15,
    backgroundColor: Colors.light.subtleBackground,
    borderRadius: 10
  },
  shareText: {
    fontFamily: 'Rubik500',
    fontSize: 15
  },
  shareRowContainer: {
    marginBottom: 40,
    width: '100%',
  }
})
