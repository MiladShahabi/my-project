import { LocationGeocodedAddress } from  'expo-location'



//category
export interface Category{
    id: string,
    title: string,
    icon: string
}


//Food Model
export interface FoodModel{
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    readyTime: number;
    images: [string]
}

//Restaurant Model

export interface Restaurant{
    _id: string;
    name: string;
    foodType: string;
    address: string;
    phone: string;
    images: string;
    foods: [FoodModel];
}

export interface FoodAvailability{
    categories: [Category];
    restaurants: [Restaurant];
    foods: [FoodModel]
}

//todo : Modify later
//User Model
export interface UserModel{
    firstName: string;
    lastName: string;
    contactNumber: string;
    token: string
}

export interface UserState{
    user: UserModel;
    location: LocationGeocodedAddress;
    error: string | undefined
}

export interface ShoppingState{
    availability: FoodAvailability,
    //other models
}