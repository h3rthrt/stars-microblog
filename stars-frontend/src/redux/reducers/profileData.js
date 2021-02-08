import { LOAD_PROFILE_ERROR, LOAD_PROFILE_SUCCESS } from "../actions/actionsTypes";

const initialState = {
    username: '',
    blogname: '',
    photoURL: '',
    desc: '',
    followers: [],
    following: [],
    media: [],
    error: ''
}

export default function profileData(state = initialState, action) {
    switch (action.type) {
        case LOAD_PROFILE_SUCCESS:
            return {
                ...state,
                username: action.username,
                blogname: action.blogname,
                photoURL: action.photoURL,
                desc: action.desc,
                followers: action.followers,
                following: action.following,
                media: action.media
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
