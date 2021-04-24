import { UPLOAD_ON_PROGRESS, UPLOAD_LOADED, UPLOAD_RESET } from '../actions/actionsTypes'
import { actionTypes } from 'react-redux-firebase'
const initialState = {
    upload: false,
    complete: false,
    tasks: []
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
                complete: action.complete,
            }
        case UPLOAD_RESET:
            return initialState
        case actionTypes.FILE_UPLOAD_PROGRESS:
            return {
                ...state,
                tasks: state.tasks.map((obj) => {
                    if (obj.filename === action.meta.filename) {
                        obj.percent = action.payload.percent
                    }
                    return obj
                })
            }
        case actionTypes.FILE_UPLOAD_START:
            return {
                ...state,
                tasks: state.tasks.concat({
                    filename: action.payload.filename,
                    percent: 0
                })
            }
        default:
            return state
    }
}