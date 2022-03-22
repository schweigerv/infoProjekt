import React, { useEffect, useRef, useState } from 'react'

import { FlatList, StyleSheet } from 'react-native';
import OsmNodeCard from './OsmNodeCard';

const styles = StyleSheet.create({
    list: {
        position: 'absolute',
        flex: 1,
        backgroundColor: 'transparent',
        height: '30%',
        bottom: 20,
        width: '100%',
        zIndex: 2,
        elevation: 2,
    },
    card: {
        height: '100%',
        width: 200,
        bottom: 0,
    },
    selectedCardText: {
        padding: 5,
        borderRadius: 10,
        height: '100%',
        width: '90%',
        backgroundColor: 'white',
        alignSelf: 'center',
        borderColor: 'lightblue',
        borderWidth: 2,
    },
    cardText: {
        padding: 5,
        borderRadius: 10,
        height: '100%',
        width: '90%',
        backgroundColor: 'white',
        alignSelf: 'center',
    }
});

export default HorizontalCardFlatList = (props) => {
    const { items, onTapCard } = props;
    let flatList;
   
    useEffect(() => {
        if (flatList && props.selectedFeature !== '') {
            const item = items.filter(item => `${item.id}` === props.selectedFeature)[0];
            flatList.scrollToItem({item, animated: true});
        }
    }, [props.selectedFeature]);

    const renderCard = ({item}) => {
        return (
            <OsmNodeCard 
                node={item}
                selected={`${item.id}` === props.selectedFeature}
                style={styles}
                onTapCard={() => onTapCard(item)} 
                key={ item.id }
            />
        );
    }

    return (
        <FlatList 
            ref={ref => flatList = ref}
            horizontal  
            style={styles.list}
            data={items}
            renderItem={renderCard}
            initialScrollIndex={0}
            keyExtractor={item => `${item.id}`}>
        </FlatList>
    )
}
