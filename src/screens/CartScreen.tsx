import React, { useState, useEffect } from 'react'
import { createRef } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Dimensions, Alert } from 'react-native'
import { connect } from 'react-redux'
import { ApplicationState, FoodModel, ShoppingState, onUpdateCart, onCreateOrder, UserState, onApplyOffer } from '../redux'

import { ButtonWithIcon, ButtonWithTitle, FoodCard, FoodCardInfo, SearchBar } from '../components'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import PaymentTypePopup from 'react-native-raw-bottom-sheet';


import { checkExistence, useNavigation } from '../utils'

interface CartScreenProps{
    userReducer: UserState,
    shoppingReducer: ShoppingState,
    onUpdateCart: Function,
    onCreateOrder: Function,
    onApplyOffer: Function,
 }


const _CartScreen: React.FC<CartScreenProps> = (props) => {

    const { navigate } = useNavigation()
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [payableAmount, setPayableAmount] = useState(0);
    const [discount, setDiscount] = useState(0);

    const { Cart, user, location, appliedOffer } = props.userReducer;

    const popupRef = createRef<PaymentTypePopup>();



    const onTapFood = (item: FoodModel ) =>{
        navigate('FoodDetailPage', { food: item})
    }

    useEffect(() => {
        onCalculateAmount()
    },[Cart]);

    const showAlert = (title: string, msg: string) => {
        Alert.alert(
            title,
            msg,
            [
                { text: 'OK', onPress: () => {
                    props.onApplyOffer(appliedOffer, true)
                }}
            ]
        )
    }

    const onCalculateAmount = () => {

        let total = 0;

        if(Array.isArray(Cart)){

                Cart.map(food => {
                total += food.price * food.unit
            })

        }

        const tax = (total /100 * 0.9) + 40;

        if(total > 0) {
            setTotalTax(tax);
        }


        setTotalAmount(total)
        setPayableAmount(total);
        setDiscount(0)

        if(appliedOffer._id !== undefined){
         
            if(total >= appliedOffer.minValue){

                const discount = (total / 100) * appliedOffer.offerPercentage;
                setDiscount(discount);
                const afterDiscount = (total - discount);
                setPayableAmount(afterDiscount);

            }else{
                showAlert('The Applied Offer is not Applicable!',
                `This offer is applicable with minimum ${appliedOffer.minValue} Only! Please select another Offer!`)

            }

        }
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
        props.onApplyOffer(appliedOffer, true);
    }

    const footerContent = () => {

        return <View style={{ flex: 1, display: 'flex' }}>
            <TouchableOpacity
            onPress={() => {
                navigate('CartOfferPage')
            }}
            style={[styles.row, { height: 80}]}
            >
                <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#525252', marginBottom: 10 }}>Offers & Deals</Text>
                        {appliedOffer._id !== undefined ?
                            <View style={{ flex: 1}}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#3D933F' }}> Applied { appliedOffer.offerPercentage} % of Discount</Text>
                            
                            </View>    
                            :
                            <View><Text style={{ fontSize: 16, color: '#EE6840'}}> You Can apply available Offers. *TnC Apply.</Text></View>
                    }
                </View>
                <Image source={require('../images/arrow_icon.png')} style={{ width: 30, height: 30 }}/>

            </TouchableOpacity>

            <View style={[styles.row, { height: 250, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column' } ]}>
                 <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#525252', marginBottom: 10 }}>Bill Details</Text>
                 <View style={ styles.paymentInfo }>
                    <Text style={{ flex: 1, fontSize: 14 }}> Total</Text>
                    <Text style={{ fontSize: 16 }}>{totalAmount.toFixed(0)} ₺‎</Text>
                </View>
                <View style={ styles.paymentInfo }>
                    <Text style={{ flex: 1, fontSize: 14 }}> Tax & Delivery Charge</Text>
                    <Text style={{ fontSize: 16 }}>{totalTax.toFixed(0)} ₺‎</Text>
                </View>
                {appliedOffer._id !== undefined &&
                <View style={ styles.paymentInfo }>
                    <Text style={{ flex: 1, fontSize: 14 }}> Discount (applied {appliedOffer.offerPercentage} % Offer)</Text>
                    <Text style={{ fontSize: 16 }}>{discount.toFixed(0)} ₺‎</Text>
                </View>
                }

                <View style={ styles.paymentInfo }>
                    <Text style={{ flex: 1, fontSize: 14 }}> Net Payable</Text>
                    <Text style={{ fontSize: 16 }}>{payableAmount.toFixed(0)} ₺‎</Text>
                </View>
            </View>

        </View>

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
                        <Text style={{ fontSize: 20, fontWeight: '600' }}> {payableAmount.toFixed(0)} ₺</Text>
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
                        ListFooterComponent={footerContent}
                    />
    
                </View>

                <View style={styles.footer}>
                    <View style={styles.amountView}>
                        <Text style={{ fontSize: 18 }}> Total</Text>
                        <Text style={{ fontSize: 18 }}>{payableAmount} ₺‎</Text>
                    </View>
                    <ButtonWithTitle title={"Make Payment"} onTap={onValidateOrder} height={50} width={320}/>
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
body: { flex: 9.5, justifyContent: 'center', alignItems: 'center'},
footer: { flex: 1.5, padding: 10, marginBottom: 15 },

paymentView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
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

row: {
    display: 'flex',
    backgroundColor: 'white', 
    justifyContent: 'space-around', 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginLeft: 10,
    paddingLeft: 10, 
    paddingRight: 10,
    marginBottom: 15
},

paymentInfo: { 
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10
},

amountView: { 
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 },

})

const mapStateToProps = (state: ApplicationState) => ({
    shoppingReducer: state.shoppingReducer,
    userReducer: state.userReducer
})

const CartScreen = connect(mapStateToProps, { onUpdateCart, onCreateOrder, onApplyOffer })(_CartScreen)

export { CartScreen }