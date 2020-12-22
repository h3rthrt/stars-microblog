import { LOAD_PROFILE_ERROR, LOAD_PROFILE_SUCCESS } from "../actions/actionsTypes";

const initialState = {
    profileData: [],
    error: ''
}

export default function profileData(state = initialState, action) {
    switch (action.type) {
        case LOAD_PROFILE_SUCCESS:
            return {
                ...state,
                profileData: action.data
            }
        case LOAD_PROFILE_ERROR:
            return {
                ...state,
                error: action.error
            }
        default:
            return state
    }
}
