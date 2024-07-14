import { Image, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import ListShareModal from './ListShareModal'
import { Colors } from '@/constants/Colors'
import IconButton from '@/components/atomic/IconButton'
import { useReplicache } from '@/context/ReplicacheContext'
import { sharesByList } from '@/entities'
import { useSubscribe } from '@/hooks/useSubscribe'

type Props = {
    listID: string;
    showCollaborators?: boolean;
}

const AVATARS = [
    require('@/assets/images/avatar/avatar0.png'),
    require('@/assets/images/avatar/avatar1.png'),
    require('@/assets/images/avatar/avatar2.png'),
    require('@/assets/images/avatar/avatar3.png'),
    require('@/assets/images/avatar/avatar4.png'),
    require('@/assets/images/avatar/avatar5.png'),
];

const ListShareButton = ({ listID, showCollaborators = true }: Props) => {

    const [showModal, setShowModal] = useState(false);

    const handleOnClose = () => {
        setShowModal(prev => !prev)
    }

    const { replicache } = useReplicache();

    const shares = useSubscribe(replicache, async (tx) => sharesByList(tx, listID), { default: [], dependencies: [ listID ] })

    const getOverlappingSharesUI = () => {

        if (!showCollaborators) {
            return;
        }

        return (
            <View style={styles.overlappingIconsInner}>
                {
                    shares.map((share, index) => {
                        const img = AVATARS[index]
                        return ( 
                            <View style={styles.overlappingIcons}>
                                <Image
                                    source={img}
                                    resizeMode='center'
                                />
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View>
            <View style={styles.overlapContainer}>
                <IconButton
                    onPressHandle={handleOnClose}
                    transparent={showCollaborators ? shares.length > 0 : false}
                >
                    <AntDesign name="adduser" size={24} color={Colors.light.text} />
                </IconButton>
                {getOverlappingSharesUI()}
            </View>
            <ListShareModal
                isVisible={showModal}
                listID={listID}
                handleClose={handleOnClose}
            />
        </View>
    )
}

export default ListShareButton;

const styles = StyleSheet.create({
    overlapContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    overlappingIcons: {
        backgroundColor: Colors.light.background,
        borderRadius: 25,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        zIndex: -1,
        marginHorizontal: -5
    },
    overlappingIconsInner: {
        display: 'flex',
        flexDirection: 'row',
    }
})