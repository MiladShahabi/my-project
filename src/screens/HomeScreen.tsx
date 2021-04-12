import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'

import { useNavigation } from '../utils'

import { connect } from 'react-redux'
import { ButtonWithIcon, CategoryCard, SearchBar, RestaurantCard } from '../components'
import { onAvailability, UserState, ApplicationState, ShoppingState } from '../redux'

interface HomeProps{
    userReducer: UserState,
    shoppingReducer: ShoppingState,
    onAvailability: Function
}

export const _HomeScreen: React.FC<HomeProps> = (props) => {

    const { navigate } = useNavigation()

    const { location } = props.userReducer;
    const { availability } = props.shoppingReducer;

    const { categories, foods, restaurants } = availability

    console.log(foods)

    useEffect(() => {
        props.onAvailability(location.postalCode)
    },[])



    return (
        <View style={styles.container}>
            <View style={styles.navigation}> 
                <View style={{ marginTop: 50, flex: 4, backgroundColor: 'white', paddingLeft: 20,paddingRight: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Text>{`${location.name},${location.street},${location.city}`}</Text> 
                    <Text> Edit</Text> 
                </View>
                <View style={{ display: 'flex', height: 60, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', marginLeft: 4}}>
                    <SearchBar didTouch={() => {
                        navigate('SearchPage')
                    }} onTextChange={() => {}} />
                    <ButtonWithIcon onTap={() => {}} icon={require('../images/hambar.png')} width={50} height={40} />
                </View>
            </View>

            <View style={styles.body}>
                <ScrollView>
                    <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    renderItem ={({ item }) => <CategoryCard item={item} onTap={() => {alert('Category tapped') }} />}
                    keyExtractor={(item) => `${item.id}`}
                    />
                    <View>
                        <Text style={{fontSize: 25, fontWeight: '600', color: '#f15b5d', marginLeft: 20 }}> Top Restaurant</Text>
                    </View>
                    <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={restaurants}
                    renderItem ={({ item }) => <RestaurantCard item={item} onTap={() => {alert('Category tapped') }} />}
                    keyExtractor={(item) => `${item._id}`}
                    />
                    
                </ScrollView>



            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    navigation: {
        flex: 2,
    },
    body: {
        flex: 10,
        justifyContent: 'center',
        alignItems:'center',
    },

})

const mapToStateProps =(state: ApplicationState) =>({
    userReducer: state.userReducer,
    shoppingReducer: state.shoppingReducer
})

const HomeScreen = connect(mapToStateProps, { onAvailability })(_HomeScreen)

export { HomeScreen }