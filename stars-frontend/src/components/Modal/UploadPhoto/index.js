import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import Button from '../../UI/Button'
import { upload, uploadReset } from '../../../redux/actions/uploadActions'
import { SHOW_MODAL } from '../../../redux/actions/actionsTypes'

const ViewPhoto = ((props) => {
	useEffect(() => {
		if(props.complete && props.isShow) {
			props.showModal()
		}
		Modal.setAppElement('body')
		return () => {
			props.uploadReset()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.complete, props.isShow] )

	async function uploadHandler() {
		await props.uploadPhoto(props.image.files, props.username, props.uid)
	}

	return (
		<CSSTransition
			in={props.isShow}
			timeout={300}
		>
			<Modal
				closeTimeoutMS={500}
				isOpen={props.isShow}
				className="modal"
				ariaHideApp={false}
				style={{
					overlay: {
						backgroundColor: 'none',
					},
				}}
			>
				<div className="modal__dialog modal__photo">
					<div className="modal__header">
						<button onClick={ () => props.showModal() }>
							<FontAwesomeIcon icon="times" className="times"/>
						</button>
					</div>
					<h2>{props.blogname}</h2>
					<div className="image-block">
						{ props.image && <img alt={props.image.alt} src={props.image.base64} /> }
						
					</div>
					<div className="modal__footer modal__photo-uploader">
						<Button 
							onClick={ () => props.showModal() } 
							cls="gray button-s">
							Отменить
						</Button>
						<Button 
							disabled={props.upload} 
							onClick={() => uploadHandler()} 
							loading={props.upload} 
							cls="green button-s">
							Сохранить
						</Button>
					</div>
				</div>
			</Modal>
		</CSSTransition>
	)
})

function mapStateToProps(state) {
	return {
		image: state.modal.image,
		isShow: state.modal.isShow,
		username: state.firebase.profile.username,
		complete: state.progress.complete,
		upload: state.progress.upload,
		uid: state.firebase.auth.uid, 
		blogname: state.profile.blogname,
	}
}

function mapDispathToProps(dispatch) {
	return {
		uploadPhoto: (files, username, uid) => dispatch(upload(files, username, uid)),
		uploadReset: () => dispatch(uploadReset()),
		showModal: () => dispatch({ type: SHOW_MODAL, modalType: 'UploadPhoto' })
	}
}

export default connect(mapStateToProps, mapDispathToProps)(ViewPhoto)
