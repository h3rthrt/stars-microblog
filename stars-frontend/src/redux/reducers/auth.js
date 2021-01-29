import { AUTH_LOGOUT, AUTH_SUCCESS } from "../actions/actionsTypes"

let token = localStorage.getItem('token')

const initialState = {
    token: token ? token : null
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                ...state, token: action.token
            }
        case AUTH_LOGOUT:
            return {
                ...state, token: null
            }
        default:
            return state
    }
}