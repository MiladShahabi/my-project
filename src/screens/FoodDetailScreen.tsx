import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { ButtonWithIcon, FoodCard } from '../components';
import { FoodModel } from '../redux';

import { useNavigation } from '../utils/useNavigation'

interface FoodDetailProps{
    navigation: { getParam: Function, goBack: Function}
  }

const FoodDetailScreen: React.FC<FoodDetailProps> = (props) => {

    const { getParam, goBack } =props.navigation;

    const food =getParam('food') as FoodModel

   // console.log(food);
    const { navigate } = useNavigation()



return (<View style={styles.container}>
        <View style={styles.navigation}>
            <ButtonWithIcon icon={require('../images/back_arrow.png')} onTap={() =>goBack()} width={42} height={42} />
                <Text style={{ fontSize: 22, fontWeight: '600', marginLeft: 60}}> {food.name}</Text>
        </View>
        <View style={styles.body}>
        <ImageBackground source={{uri: `${food.images[0]}`}}
        style={{ width: Dimensions.get('screen').width, height: 300, justifyContent: 'flex-end', }}
        >
        <View style={{ height: 120, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10 }}>

          <Text style={{ color: '#FFF', fontSize: 30, fontWeight: '700' }} > {food.name}</Text>  
          <Text style={{ color: '#FFF', fontSize: 25, fontWeight: '500' }} > {food.category} </Text>

        </View>
        </ImageBackground>
          <View style={{ display: 'flex', height: 300, padding: 30}}> 
          <Text> Food will be ready within {food.readyTime} Minite(s)</Text>
          <Text>{food.description}</Text>
          </View>
          <View style={{ height: 120}}>
              <FoodCard item={food} onTap={() => {}} />

          </View>



          
      </View>
</View>)}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F2F2F2'},
navigation: { flex: 1, marginTop: 43, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' },
body: { flex: 10, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 160 },
footer: { flex: 1, backgroundColor: 'cyan' }
})
 export { FoodDetailScreen }