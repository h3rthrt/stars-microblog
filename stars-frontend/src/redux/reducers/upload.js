import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED } from '../actions/actionsTypes'
const initialState = {
    upload: false,
    complete: false
}

export default function upload(state = initialState, action) {
    switch (action.type) {
        case UPLOAD_ON_PROGRESS:
            return {
                ...state,
                upload: true
            }
        case UPLOAD_LOADED:
            return {
                ...state,
                upload: false,
                complete: action.complete
            }
        default:
            return state
    }
}