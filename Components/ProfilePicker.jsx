import { StyleSheet, View } from "react-native"
import { IconButton } from 'react-native-paper';

const styles = StyleSheet.create({
    picker: {
        width: '100%',
        alignContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    profileBtn: {
        backgroundColor: 'white',
    }
});

export default ProfilePicker = (props) => {
    const { onProfileSelection } = props;

    return (
        <View style={styles.picker}>
            <IconButton 
              icon="walk"
              style={styles.profileBtn}
              onPress={() => onProfileSelection('walking')}
            />
            <IconButton 
              icon="bike"
              style={styles.profileBtn}
              onPress={() => onProfileSelection('cycling')}
            />
            <IconButton 
              icon="car"
              style={styles.profileBtn}
              onPress={() => onProfileSelection('driving')}
            />
        </View>
    );
}