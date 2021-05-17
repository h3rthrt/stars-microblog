import React from 'react'
import { connect } from 'react-redux'
import WarningMsg from './WarningMsg'
import UploadPhoto from './UploadPhoto'
import CreatePost from './CreatePost'
import CreateAcc from './CreateAcc'

function Modal(props) {
	switch (props.type) {
		case 'WarningMsg':
			return (
				<WarningMsg />
			)
		case 'UploadPhoto':
			return (
				<UploadPhoto />
			)
		case 'CreateAcc':
			return (
				<CreateAcc />
			)
		case 'CreatePost':
			return (
				<CreatePost />
			)
		default:
			return false
	}
}

function mapStateToProps(state) {
	return {
		type: state.modal.modalType,
		isShow: state.modal.isShow
	}
}

export default connect(mapStateToProps)(Modal)
