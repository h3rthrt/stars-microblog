import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED } from '../actions/actionsTypes'
const initialState = {
    upload: false
}

export default function upload(state = initialState, action) {
    switch (action.type) {
        case UPLOAD_ON_PROGRESS:
            return {
                ...state,
                upload: action.upload
            }
        case UPLOAD_LOADED:
            return {
                ...state,
                upload: action.upload
            }
        default:
            return state
    }
}