import { Text, TouchableWithoutFeedback, View } from "react-native";


const OsmNodeCard = (props) => {
    const { style, onTapCard, node, selected } = props;


    return (
        <TouchableWithoutFeedback onPress={onTapCard}>
            <View style={ style.card }>
                <View style={ selected ? style.selectedCardText : style.cardText }>
                    { node.tags && Object.keys(node.tags).map(key => <Text>{key}: { node.tags[key] }</Text>) }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
} 

export default OsmNodeCard;