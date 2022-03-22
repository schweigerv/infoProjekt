import { Picker } from "@react-native-community/picker";
import { View } from "react-native"

const TimePicker = (props) => {
    const { minutes, setMinutes } = props;
    return (
        <View>
            <Picker 
                selectedValue={minutes}
                onValueChange={(itemValue, itemIndex) => {
                        console.log(itemValue);
                        setMinutes(itemValue);
                    }
                }>
                <Picker.Item label="10min" value="10"></Picker.Item>
                <Picker.Item label="20min" value="20"></Picker.Item>
                <Picker.Item label="30min" value="30"></Picker.Item>
                <Picker.Item label="40min" value="40"></Picker.Item>
                <Picker.Item label="50min" value="50"></Picker.Item>
                <Picker.Item label="1h" value="60"></Picker.Item>
            </Picker>
        </View>
    )
}

export default TimePicker;