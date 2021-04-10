import axios from 'axios'
import { LocationGeocodedAddress } from 'expo-location'
import { Dispatch } from 'react'
import { BASE_URL } from '../../utils'
import { FoodAvailability } from '../models'

//availability Action

export interface AvailabilityAction{
    readonly type: 'ON_AVAILABILITY'
    payload: FoodAvailability
}

export interface ShoppingErrorAction{
    readonly type: 'ON_SHOPPING_ERROR',
    payload: any
}

export type ShoppingAction = AvailabilityAction | ShoppingErrorAction



//Triger actions from components
export const onAvailability = (postCode: string) => {

    console.log(`Post Code with request ${postCode}`);

    return async ( dispatch: Dispatch<ShoppingAction>) => {

        try { 

            const response = await axios.get<FoodAvailability>( `${BASE_URL}food/availability/${postCode}` )
            
            console.log(response)

            if(!response){
                dispatch({
                    type: 'ON_SHOPPING_ERROR',
                    payload: 'Availability error'
                })
            }else{
            // save our location in local storage
            dispatch({
                type: 'ON_AVAILABILITY',
                payload: response.data
            })  
        }

        } catch (error) {
            dispatch({
                type: 'ON_SHOPPING_ERROR',
                payload: error
            })
        }     
    }
}
