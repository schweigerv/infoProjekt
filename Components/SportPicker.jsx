import { Picker } from "@react-native-community/picker";
import { View, Text } from "react-native";

export default SportPicker = props => {
    const {sport, setSport} = props;

    return (
            <Picker 
        selectedValue={sport}
        onValueChange={(itemValue, itemIndex) => {
                setSport(itemValue);
            }
        }>
            <Picker.Item label="Tennis" value="tennis"></Picker.Item>
            <Picker.Item label="Swimming" value="swimming"></Picker.Item>
            <Picker.Item label="Climbing" value="climbing"></Picker.Item>
            <Picker.Item label="Volleyball" value="volleyball"></Picker.Item>
            <Picker.Item label="Yoga" value="yoga"></Picker.Item>
        </Picker>
    )
}