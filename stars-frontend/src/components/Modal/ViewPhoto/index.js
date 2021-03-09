import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import Button from '../../UI/Button'
import { uploadPhoto, uploadReset } from '../../../redux/actions/uploadActions'

const ViewPhoto = ((props) => {
	console.log(props.complete, props.upload)
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

	async function uploadPhotoHandler() {
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
					<div className="modal__footer">
						<Button 
							onClick={() => hideModalHandler()} 
							cls="gray button-l">
							Отменить
						</Button>
						<Button 
							disabled={props.upload} 
							onClick={() => uploadPhotoHandler()} 
							loading={props.upload} 
							cls="primary button-l">
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
		uploadPhoto: (files, username, uid) => dispatch(uploadPhoto(files, username, uid)),
		uploadReset: () => dispatch(uploadReset())
	}
}

export default connect(mapStateToProps, mapDispathToProps)(ViewPhoto)
