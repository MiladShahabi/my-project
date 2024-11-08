import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { ButtonWithIcon, FoodCard } from '../components';
import { connect } from 'react-redux';
import { Restaurant, FoodModel, ApplicationState, onUpdateCart, UserState } from '../redux';
import { checkExistence } from '../utils';

import { useNavigation } from '../utils/useNavigation'

interface RestaurantProps{
    userReducer: UserState,
    onUpdateCart: Function,
    navigation: { getParam: Function, goBack: Function}
  }

const _RestaurantScreen: React.FC<RestaurantProps> = (props) => {

    const { getParam, goBack } =props.navigation;

    const restaurant =getParam('restaurant') as Restaurant

   // console.log(restaurant);
    const { navigate } = useNavigation()

    const { Cart } = props.userReducer;

    const onTapFood = (item: FoodModel ) =>{
      navigate('FoodDetailPage', { food: item})
}

return (<View style={styles.container}>
        <View style={styles.navigation}>
            <ButtonWithIcon icon={require('../images/back_arrow.png')} onTap={() =>goBack()} width={42} height={42} />
                <Text style={{ fontSize: 22, fontWeight: '600', marginLeft: 80}}> {restaurant.name}</Text>
        </View>
        <View style={styles.body}>
        <ImageBackground source={{uri: `${restaurant.images[0]}`}}
        style={{ width: Dimensions.get('screen').width, height: 300, justifyContent: 'flex-end', }}
        >
        <View style={{ height: 120, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10 }}>

          <Text style={{ color: '#FFF', fontSize: 40, fontWeight: '700' }} > {restaurant.name}</Text>  
          <Text style={{ color: '#FFF', fontSize: 25, fontWeight: '500' }} > {restaurant.address} {restaurant.phone}</Text>

        </View>
        </ImageBackground>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={restaurant.foods}
            renderItem={({ item }) => <FoodCard item={checkExistence(item, Cart)} onTap={onTapFood} onUpdateCart={props.onUpdateCart} />}
            keyExtractor={(item) => `${item._id}`}
        />
        
        </View>
</View>)}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F2F2F2'},
navigation: { flex: 1, marginTop: 43, paddingLeft: 10, flexDirection: 'row', alignItems: 'center' },
body: { flex: 10, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFF', },
footer: { flex: 1, backgroundColor: 'cyan' }
})

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer
})

const RestaurantScreen = connect(mapStateToProps, {onUpdateCart})(_RestaurantScreen)

 export { RestaurantScreen }