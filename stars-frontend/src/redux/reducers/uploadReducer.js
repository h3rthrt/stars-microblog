import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET } from '../actions/actionsTypes'
const initialState = {
    upload: false,
    complete: false
}

export default function uploadReducer(state = initialState, action) {
    switch (action.type) {
        case UPLOAD_ON_PROGRESS:
            return {
                ...state,
                upload: action.upload
            }
        case UPLOAD_LOADED:
            return {
                ...state,
                upload: false,
                complete: action.complete
            }
        case UPLOAD_RESET:
            return initialState
        default:
            return state
    }
}