import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { connect } from 'react-redux'
import { ApplicationState, FoodModel, ShoppingState, onUpdateCart, UserState, onGetOffers, OfferModel } from '../redux'

import { ButtonWithIcon, OfferCard } from '../components'
import { FlatList } from 'react-native-gesture-handler'


import { checkExistence, useNavigation } from '../utils'

interface OfferScreenProps{
    userReducer: UserState,
    shoppingReducer: ShoppingState,
    onUpdateCart: Function,
    onGetOffers: Function,
 }
const _OfferScreen: React.FC<OfferScreenProps> = ({ userReducer, shoppingReducer, onGetOffers }) => {

const { location } =userReducer;
const { offers } = shoppingReducer;

useEffect(() => {
    onGetOffers(location.postalCode)
},[])

//if(Array.isArray(offers)) { alert(offers.length) }

const onTapApplyOffer = (item: OfferModel) => {


}

const onTapRemoveOffer = (item: OfferModel) => {

    // Remove Offer
}


return (<View style={styles.container}>
            <View style={styles.navigation}> 
                <View style={{ display: 'flex', height: 60, justifyContent: 'center', 
                flexDirection: 'row', alignItems: 'center', marginLeft: 4, paddingLeft: 20, paddingRight: 20}}>
                        
                        {/* <ButtonWithIcon icon={require('../images/back_arrow.png')} 
                        onTap={() => goBack()} 
                        width={32} height={38} /> */}
                        <Text style={{ fontSize: 22, fontWeight: '600'}}>Offers & Deals</Text>
    
                    </View>


            </View>

            <View style={styles.body}>
                    
                {Array.isArray(offers) && 
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    data={offers}
                    renderItem={({ item }) => 
                    <OfferCard 
                    onTapApply={onTapApplyOffer} 
                    onTapRemove={onTapRemoveOffer}
                    item = {item}
                    isApplied={false}
                    /> 
                    }
                    keyExtractor={(item) => `${item._id}`}
                />
                }

            </View>
</View>)}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#F2F2F2'},
navigation: { flex: 1, marginTop: 43, },
body: { flex: 10, justifyContent: 'center', alignItems: 'center'},
footer: { flex: 1, backgroundColor: 'cyan' }
})

const mapStateToProps = (state: ApplicationState) => ({
    shoppingReducer: state.shoppingReducer,
    userReducer: state.userReducer
})

const OfferScreen = connect(mapStateToProps, { onGetOffers })(_OfferScreen)

export { OfferScreen }