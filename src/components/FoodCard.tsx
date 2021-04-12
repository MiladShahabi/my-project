import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { FoodModel } from '../redux'

interface FoodCardProps{
    item: FoodModel;
    onTap: Function
}



const FoodCard : React.FC<FoodCardProps> = ({ item, onTap }) => {


return (<View style={styles.container}>

        <Image source={{ uri: `${item.images[0]}`}} style={{ width: 100, height: 100, borderRadius: 20, backgroundColor: 'EAEAEA'}} />
        <TouchableOpacity onPress={() => onTap(item)} style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
            <View style={{ display: 'flex', flex: 8, padding: 10}}>
                <Text>{item.name}</Text>
                <Text>{item.category}</Text>
            </View>
            <View style={{ display: 'flex', flex: 4, padding: 10, justifyContent: 'space-around', alignItems: 'center'}}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#7C7C7C'}}> {item.price}</Text>
            </View>
        </TouchableOpacity>

</View>)}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: 'green'},
navigation: { flex: 2, backgroundColor: 'red'},
body: { flex: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow'},
footer: { flex: 1, backgroundColor: 'cyan' }
})
 export { FoodCard }