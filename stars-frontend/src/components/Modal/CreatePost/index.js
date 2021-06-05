import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { upload, uploadReset } from '../../../redux/actions/uploadActions'
import ReactTagInput from '@pathofdev/react-tag-input'
import './../Modal.sass'
import Button from '../../UI/Button'
import { SHOW_MODAL } from '../../../redux/actions/actionsTypes'

function CreateNote(props) {
	const inputImageRef = useRef()
	const [ validate, setValidate] = useState(false)
	const [ image, setImage ] = useState({ images: [] })
    const [ post, setPost ] = useState({
        header: null,
        text: null,
		photoURL: [],
        tags: [],
		notes: 0,
		repost: false
    })

	const closeModal = useCallback(() => {
		props.showCreateNote()
		setPost(() => {
			return {
				header: null,
				text: null,
				photoURL: [],
				tags: [],
				notes: 0,
				repost: false
			}
		})
		setImage(() => {
			return { images: [] }
		})
		props.uploadReset()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]) 

	useEffect(() => {
		if(props.complete)
			closeModal()
		if(post.header || post.text || image.images.length) {
			setValidate(true)
		} else {
			setValidate(false)
		}
	}, [closeModal, post.header, post.text, image.images, props.complete])

	function addPostHandler() {
		props.uploadPost(
			image.images,
			props.username,
			props.uid,
			true,
			post
		)
	}

	function changeHeaderHandler(ev) {
		return(
			setPost((prevState) => {
				return {
					...prevState,
					header: ev.target.value
				}
			})
		)
	}

	function changeTextHandler(ev) {
		return(
			setPost((prevState) => {
				return {
					...prevState,
					text: ev.target.value
				}
			})
		)
	}

	function changeHandler(event) {
		let _URL = window.URL || window.webkitURL
		if (!event.target.files.length) {
			return
		}
		const files = Array.from(event.target.files)
		files.forEach((file, index) => {
			if (!file.type.match('image')) return
			let img = new Image()
			const reader = new FileReader()
			reader.onload = (ev) => {
				img.src = _URL.createObjectURL(file)
				img.onload = function() {
					const imgSize = {
						width: this.width,
						height: this.height
					}
					setImage((prevState) => {
						return {
							images: [
								...prevState.images,
								{
									base64: ev.target.result,
									alt: file.name,
									file: event.target.files[index],
									width: imgSize.width,
									height: imgSize.height
								}
							]
						}
					})
				}
			}
			reader.readAsDataURL(file)
		})
	}

	function clickInputHandler() {
		if (image.images.length) {
			setImage({ images: [] })
		}
		inputImageRef.current.click()
	}

	function removeImageHandler(img) {
		setImage((prevState) => {
			const images = prevState.images.filter((imageState) => imageState.alt !== img.alt)
			return { images }
		})
	}

    function setTagsHandler(newTags) {
        setPost((prevState) => {
            return {
                ...prevState,
                tags: newTags
            }
        })
    }

	console.log(image)

	return (
		<CSSTransition
			in={props.isShow}
			timeout={300}
		>
			<Modal
				closeTimeoutMS={500}
				isOpen={!!(props.isShow && props.blogname)}
				className="modal"
				ariaHideApp={false}
				style={{
					overlay: {
						backgroundColor: 'none',
					},
				}}
			>
				<div className="modal__dialog">
					<div className="modal__header">
						<button onClick={ () => props.showCreateNote() }>
							<FontAwesomeIcon icon="times" className="times" />
						</button>
					</div>
					<div className="modal__create">
						<input 
							placeholder="Заголовок" 
							className="modal__header" 
							onChange={(ev) => changeHeaderHandler(ev)} />
						<hr />
						<div className="post__images">
							{ image.images ? (
								image.images.map((image, index) => {
									return (
										<div className="img-box" key={index}>
											{ 
												!!props.tasks.length ?
												<div className="img-box__upload-progress">
													<div className="img-box__upload-progress--bar">
														<span style={{'--progress': `${ props.tasks[index].percent }%`}} />
													</div>
												</div>
												:
												<div className="img-box__times" onClick={() => removeImageHandler(image)}>
													&times;
												</div>
										
											}
											<img
												className="img-box__img"
												style={{ display: 'block' }}
												alt={image.alt}
												src={image.base64}
											/>
											<div className="img-box__alt">
												<span>{image.alt}</span>
											</div>
										</div>
									)
								})
							) : null }
						</div>
						<textarea 
							placeholder="Текст"
							maxLength="280" 
							className="modal__text" 
							onChange={(ev) => changeTextHandler(ev)} />
						<hr />
						<button onClick={() => clickInputHandler()}>
							<FontAwesomeIcon icon="photo-video" />
						</button>
						<input
							className="input-image"
							type="file"
							accept="image/jpeg,image/pjpeg,image/gif,image/png"
							multiple={true}
							ref={inputImageRef}
							onChange={(event) => changeHandler(event)}
						/>
						<button>
							<FontAwesomeIcon icon="file-audio" />
						</button>
					</div>
					<div className="modal__footer-create">
						<div className="modal-left">
							<ReactTagInput 
								tags={post.tags} 
								onChange={(newTags) => setTagsHandler(newTags)} 
								maxTags={5}
								placeholder='теги'
								validator={
									(value) => {
										const validate = value.length > 16 || value.length < 2
										if (validate) {
											alert('Количество символов в теге не должно быть меньше 2 или превышать 16 символов')
										}
										return !validate
									}
								}
							/>
						</div>
						<div className="modal-right">
							<Button 
								loading={props.upload} 
								disabled={!validate} 
								color="blue button-s" 
								onClick={() => addPostHandler()}>
								Создать
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</CSSTransition>
	)
}

function mapStateToProps(state) {
	return {
		blogname: state.firebase.profile.blogname,
		username: state.firebase.auth.displayName,
		uid: state.firebase.auth.uid,
		photoURL: state.firebase.auth.photoURL,
		complete: state.progress.complete,
		upload: state.progress.upload,
		tasks: state.progress.tasks,
		isShow: state.modal.isShow
	}
}

function mapDispatchToProps(dispatch) {
	return {
		uploadPost: (files, username, uid, forPosts, post) => dispatch(upload(files, username, uid, forPosts, post)),
		uploadReset: () => dispatch(uploadReset()),
		showCreateNote: () => dispatch({ type: SHOW_MODAL, modalType: 'CreatePost' })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNote)