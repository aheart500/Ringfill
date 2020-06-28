import {
    USER_REGISTRATION,
    USER_LOGIN,
    USER_LOGOUT,
    SET_SUCCESS_MSG,
    SET_ERROR_MSG,
    CLEAR_MSG,
    USER_RECHARGE,
    SET_USER
} from './../types';

export default function UserReducer(state, action) {
    switch (action.type) {
        //Registration
        case USER_REGISTRATION:
            return {
                ...state,
                isLoggedIn: false,
                successMsg: action.payload,
                errorMsg: '',
            };

        //Login
        case USER_LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                successMsg: action.payload,
                errorMsg: '',
            };

        //Logout
        case USER_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                successMsg: '',
                errorMsg: '',
            };
        case USER_RECHARGE:
            return {
                ...state,
                successMsg: '',
                errorMsg: '',
            };
        case SET_SUCCESS_MSG:
            return {
                ...state,
                successMsg: action.payload,
                errorMsg: '',
            };

        case SET_ERROR_MSG:
            return {
                ...state,
                successMsg: '',
                errorMsg: action.payload,
            };

        case CLEAR_MSG:
            return {
                ...state,
                successMsg: '',
                errorMsg: '',
            };

        case SET_USER:
            return {
                ...state,
                loggedInUser: {
                    email: action.payload.email,
                    first_name: action.payload.first_name,
                    last_name: action.payload.last_name,
                    mobile: action.payload.mobile,
                    id: action.payload.id
                }
            };
        default: return state;
    }
}
