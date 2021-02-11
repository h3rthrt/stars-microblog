import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import Button from '../../UI/Button'
import { uploadPhoto } from '../../../redux/actions/actions'

const ViewPhoto = ((props) => {
	useEffect(() => {
		console.log(props.complete, props.view)
		if(props.complete && props.view) {
			hideModalHandler()
		}
	})

	function hideModalHandler() {
		setTimeout(() => {
			props.onClose()
		}, 100)
		document.getElementById('modal').classList.add('hide')
	}

	function uploadPhotoHandler() {
		props.uploadPhoto(props.image.files, props.username)
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
						<Button onClick={() => hideModalHandler()} cls="gray button-l">Отменить</Button>
						<Button 
							disabled={props.upload} 
							onClick={() => {uploadPhotoHandler()}} 
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
		upload: state.progress.upload,
		username: state.auth.username,
		complete: state.progress.complete
	}
}

function mapDispathToProps(dispatch) {
	return {
		uploadPhoto: (files, username) => dispatch(uploadPhoto(files, username))
	}
}

export default connect(mapStateToProps, mapDispathToProps)(ViewPhoto)
