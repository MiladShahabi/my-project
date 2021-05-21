import React, { useState, useEffect } from 'react'
import { createRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { ApplicationState, FoodModel, ShoppingState, onUpdateCart, onCreateOrder, UserState } from '../redux'

import { ButtonWithIcon, ButtonWithTitle, FoodCard, FoodCardInfo, SearchBar } from '../components'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import PaymentTypePopup from 'react-native-raw-bottom-sheet';


import { checkExistence, useNavigation } from '../utils'

interface CartScreenProps{
    userReducer: UserState,
    shoppingReducer: ShoppingState,
    onUpdateCart: Function,
    onCreateOrder: Function
 }


const _CartScreen: React.FC<CartScreenProps> = (props) => {

    const { navigate } = useNavigation()
    const [totalAmount, setTotalAmount] = useState(0)
    // const {totalTax, setTotalTax} = useState(0)

    const [isEditing, setIsEditing] = useState(false)
    const [keyword, setKeyword] = useState('')

    const {availableFoods} =props.shoppingReducer;

    const { Cart, user, location, orders } = props.userReducer;

    const popupRef = createRef<PaymentTypePopup>();

    console.log(orders);

    const onTapFood = (item: FoodModel ) =>{
        navigate('FoodDetailPage', { food: item})
    }

    //console.log(availableFoods)

    useEffect(() => {
        onCalculateAmount()
    },[Cart]);

    const onCalculateAmount = () => {

        let total = 0;

        if(Array.isArray(Cart)){

                Cart.map(food => {
                total += food.price * food.unit
            })

        }

        setTotalAmount(total)
    }

    const onValidateOrder = () => {
        
        if(user !== undefined){
            if(!user.verified){
                //navigate to login page
                navigate('LoginPage')
            }else{
                //place the order
                popupRef.current?.open();
            }
        }else{
            navigate('LoginPage')
            
        }
    }

    //after the payment operation call place Order
    const onTapPlaceOrder = () => {
        props.onCreateOrder(Cart, user);
        popupRef.current?.close();
    }

    const popupView = () => {

        return (
            <PaymentTypePopup
                height={400}
                ref={popupRef}
                closeOnDragDown={true}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'transparent'
                    },
                    draggableIcon: {
                        backgroundColor: '#000'
                    },
                    container: {
                        justifyContent: 'flex-start', 
                        alignItems: 'center'
                    }
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        width: '100%'
                    }}
                >
                    <View style={styles.paymentView}>
                        <Text style={{ fontSize: 20 }}> Payable Amount</Text>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}> {totalAmount.toFixed(2)} ₺</Text>
                    </View>

                    <View style={{ display: 'flex', height: 100, padding: 20, flexDirection: 'row'}}>
                        <Image source={require('../images/delivery_icon.png')} style={{ width: 50, height: 50 }}/>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>Address Used to Delivery</Text>
                            <Text style={{ fontSize: 16, color: '#666666', marginBottom: 5, width: Dimensions.get('screen').width - 60}}>{`${location.name}, ${location.street}, ${location.postalCode}, ${location.city}`} </Text>
                        </View>
                        
                    </View>

                    <ScrollView horizontal={true}>
                        <View style={styles.paymentOptions}>
                            <TouchableOpacity
                                onPress={() => onTapPlaceOrder()}
                                style={styles.options}
                            >   
                                <Image source={require('../images/cod_icon.png')} style={styles.icon}/>
                                <Text style={styles.optionText}> Cash On Delivery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {}}
                                style={styles.options}
                            >   
                                <Image source={require('../images/card_icon.png')} style={styles.icon}/>
                                <Text style={styles.optionText}> Card Payment</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                </View>
            </PaymentTypePopup>
        );
    }

    if(Cart.length > 0){

        return (<View style={styles.container}>
                <View style={styles.navigation}> 
                        <View style={{ display: 'flex', height: 60, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginLeft: 4, paddingLeft: 20, paddingRight: 20}}>
                                <Text style={{ fontSize: 18, fontWeight: '600'}}> My Cart</Text>
                                {user.token !== undefined && <TouchableOpacity style={{ alignItems: 'center'}}
                                    onPress={() => {
                                        // go to the order Details page
                                        navigate('OrderPage')
                                    }}
                                >
                                    <Image source={require('../images/orders.png')} style={{ width: 50, height: 50 }}/>
                                </TouchableOpacity> }

                        </View>
                    </View>
    
                <View style={styles.body}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={ Cart }
                        renderItem={({ item }) => <FoodCardInfo 
                        onTap={onTapFood} 
                        item={checkExistence(item, Cart)} 
                        onUpdateCart={props.onUpdateCart}/> }
                        keyExtractor={(item) => `${item._id}`}
                    />
    
                </View>

                <View style={styles.footer}>
                    <View style={styles.amountView}>
                        <Text style={{ fontSize: 18 }}> Total</Text>
                        <Text style={{ fontSize: 18 }}> {totalAmount}</Text>
                    </View>
                    <ButtonWithTitle title={"Order Now"} onTap={onValidateOrder} height={50} width={320}/>
                </View>

                {popupView()}

            </View>)

    }else{

        return (<View style={styles.container}>
            <View style={styles.navigation}> 
                    <View style={{ display: 'flex', height: 60, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginLeft: 4, paddingLeft: 20, paddingRight: 20}}>
                            <Text style={{ fontSize: 18, fontWeight: '600'}}> My Cart</Text>
                            {user.token !== undefined && <TouchableOpacity style={{ alignItems: 'center'}}
                                onPress={() => {
                                    // go to the order Details page
                                    navigate('OrderPage')
                                }}
                            >
                                <Image source={require('../images/orders.png')} style={{ width: 50, height: 50 }}/>
                            </TouchableOpacity> }

                    </View>
                </View>
    
                <View style={styles.body}>
                    <Text style={{ fontSize: 25, fontWeight: '600'}}> Your Cart is Empty </Text>
    
                </View>

            </View>)


    }


}

const styles = StyleSheet.create({

container: { flex: 1, backgroundColor: '#F2F2F2'},
navigation: { flex: 1, marginTop: 43, },
body: { flex: 9, justifyContent: 'center', alignItems: 'center'},
footer: { flex: 2, padding: 10 },

paymentView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    margin: 5,
    backgroundColor: '#E3BE74'
},

paymentOptions: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20

},

options: {
    display: 'flex',
    height: 120,
    width: 160,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 10,
    borderColor: '#A0A0A0',
    backgroundColor: '#F2F2F2',
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 10
},

icon: {
    width: 115,
    height: 80,
},

optionText: {
    fontSize: 16, 
    fontWeight: '600',
    color: '#545252'
},

amountView: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 },

})

const mapStateToProps = (state: ApplicationState) => ({
    shoppingReducer: state.shoppingReducer,
    userReducer: state.userReducer
})

const CartScreen = connect(mapStateToProps, { onUpdateCart, onCreateOrder })(_CartScreen)

export { CartScreen }