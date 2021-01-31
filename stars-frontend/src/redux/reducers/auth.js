import { AUTH_LOGOUT, AUTH_SUCCESS, AUTH_ERROR } from "../actions/actionsTypes"

let token = localStorage.getItem('token')

const initialState = {
    token: token ? token : null,
    error: ''
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
        case AUTH_ERROR:
            return {
                error: action.error
            }
        default:
            return state
    }
}