import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'

import { useNavigation } from '../utils'

import { connect } from 'react-redux'
import { SearchBar } from '../components'
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
                {/* <View style={{ marginTop: 50, flex: 4, backgroundColor: 'white', paddingLeft: 20,paddingRight: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Text>{`${location.name},${location.street},${location.city}`}</Text> 
                    <Text> Edit</Text> 
                </View> */}

                    <Text>Navigation {JSON.stringify(location)} </Text>

                {/* <View style={{ flex: 8, backgroundColor: 'green'}}>
                    <SearchBar didTouch={() => {
                        navigate('SearchPage')
                    }} onTextChange={() => {}} />

                </View> */}
            </View>

            <View style={styles.body}>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'green'
    },
    navigation: {
        flex: 2,
        backgroundColor: 'red'
    },
    body: {
        flex: 9,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'yellow'
    },
    footer: {
        flex: 1,
        backgroundColor: 'cyan'
    }

})

const mapToStateProps =(state: ApplicationState) =>({
    userReducer: state.userReducer,
    shoppingReducer: state.shoppingReducer
})

const HomeScreen = connect(mapToStateProps, { onAvailability })(_HomeScreen)

export { HomeScreen }