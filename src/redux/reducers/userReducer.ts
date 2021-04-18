import { LocationGeocodedAddress } from 'expo-location'
import { UserAction } from '../actions'
import { FoodModel, UserModel, UserState } from '../models'

const initialState: UserState = {
    user: {} as UserModel,
    location: {} as LocationGeocodedAddress,
    error: undefined,
    Cart: {} as [FoodModel]

}

const UserReducer = (state: UserState = initialState, action: UserAction) =>{

    switch(action.type){
        case 'ON_UPDATE_LOCATION':
            return { 
                ...state,
                location: action.payload
            }
        case 'ON_UPDATE_CART':
            //console.log(action.payload)
            //break;
            if(!Array.isArray(state.Cart)){
                return{
                    ...state,
                    Cart: [action.payload]
                }
            }
            
            const existingFoods = state.Cart.filter(item => item._id === action.payload._id)

            if(existingFoods.length > 0){

                let updateCart = state.Cart.map((food) => {
                    if(food._id === action.payload._id){
                        food.unit = action.payload.unit
                    }

                    return food;
                })

                return {
                    ...state,
                    Cart: updateCart.filter(item => item.unit > 0)
                }

            }else{
                return {
                    ...state,
                    Cart: [...state.Cart, action.payload] 
                }
                
            }
        case 'ON_USER_LOGIN':
            console.log('User Login....')
            console.log(action.payload)
            return state;
            

        default:
            return state;
    }

}


export { UserReducer }
