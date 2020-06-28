import {
    OPEN_LOGIN,
    CLOSE_LOGIN,
    OPEN_REG,
    CLOSE_REG,
    CHANGE_LANG
} from '../types';

export default function ModalReducer(state, action) {
    switch (action.type) {
        case OPEN_LOGIN: 
            return {
                ...state,
                loginModal: true,
            }

        case CLOSE_LOGIN: 
            return {
                ...state,
                loginModal: false,
            }

        case OPEN_REG: 
            return {
                ...state,
                regModal: true,
            }

        case CLOSE_REG: 
            return {
                ...state,
                regModal: false,
            }

        case CHANGE_LANG:
            return {
                ...state,
                loginModal: false,
                regModal: false,
                language: action.payload
            }

        default:
            return state;
    }
}
