import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import Button from '../../UI/Button'
import { upload, uploadReset } from '../../../redux/actions/uploadActions'

const ViewPhoto = ((props) => {
	// console.log(props.complete, props.upload)
	useEffect(() => {
		if(props.complete && props.view) {
			hideModalHandler()
		}
	})

	function hideModalHandler() {
		setTimeout(() => {
			props.onClose()
		}, 100)
		document.getElementById('modal').classList.add('hide')
		props.uploadReset()
	}

	async function uploadHandler() {
		await props.uploadPhoto(props.image.files, props.username, props.uid)
	}

	if(props.view) { 
		return (
			<div id="modal" className="modal">
				<div className="modal__dialog modal__photo">
					<div className="modal__header">
                        <button onClick={() => hideModalHandler()}>
                            <FontAwesomeIcon icon="times" className="times"/>
                        </button>
                    </div>
					<h2>{props.blogname}</h2>
					<div className="image-block">
						<img alt={props.image.alt} src={props.image.base64} />
					</div>
					<div className="modal__footer modal__photo-uploader">
						<Button 
							onClick={() => hideModalHandler()} 
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
			</div>
		)
	} else {
		return null
	}
})

function mapStateToProps(state) {
	return {
		username: state.firebase.profile.username,
		complete: state.progress.complete,
		upload: state.progress.upload,
		uid: state.firebase.auth.uid
	}
}

function mapDispathToProps(dispatch) {
	return {
		uploadPhoto: (files, username, uid) => dispatch(upload(files, username, uid)),
		uploadReset: () => dispatch(uploadReset())
	}
}

export default connect(mapStateToProps, mapDispathToProps)(ViewPhoto)
