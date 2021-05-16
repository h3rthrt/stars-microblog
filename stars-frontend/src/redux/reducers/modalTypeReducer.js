import { SHOW_MODAL } from "../actions/actionsTypes"

const initialState = {
	modalType: '',
	isShow: false,
	image: null
}

export default function modalTypeReducer(state = initialState, action) {
	switch (action.type) {
		case SHOW_MODAL:
			return {
				modalType: action.modalType,
				isShow: !state.isShow,
				image: action.image || null
			}
		default:
			return state
	}
}