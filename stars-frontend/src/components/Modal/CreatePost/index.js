import React, { useState, useRef, useEffect } from 'react'
import { useFirestore } from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTagInput from '@pathofdev/react-tag-input'
import { connect } from 'react-redux'
import './../Modal.sass'
import Button from '../../UI/Button'

function CreateNote(props) {
	const firestore = useFirestore()
	const inputImageRef = useRef()
	const [ validate, setValidate] = useState(false)
	const [ image, setImage ] = useState({ images: [] })
    const [ post, setPost ] = useState({
		username: props.username,
		blogname: props.blogname,
        header: null,
        text: null,
        tags: []
    })

	useEffect(() => {
		if(post.header || post.text || post.tags.length || image.images.length) {
			setValidate(true)
		} else {
			setValidate(false)
		}
	}, [post.header, post.text, post.tags, image.images])

	
	function addPost() {
		return firestore.collection('posts').add(post) 
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
		if (!event.target.files.length) {
			return
		}
		const files = Array.from(event.target.files)
		files.forEach((file, index) => {
			if (!file.type.match('image')) {
				return
			}
			const reader = new FileReader()
			reader.onload = (ev) => {
				setImage((prevState) => {
					return {
						images: [
							...prevState.images,
							{
								base64: ev.target.result,
								alt: file.name,
								file: event.target.files[index]
							}
						]
					}
				})
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
			return {
				images
			}
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

	if (props.view) {
		return (
			<div className="modal">
				<div className="modal__dialog">
					<div className="modal__header">
						<button onClick={() => props.onShow()}>
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
							{image.images.length ? (
								image.images.map((image, index) => {
									return (
										<div className="img-box" key={index}>
											<div className="img-box__times" onClick={() => removeImageHandler(image)}>
												&times;
											</div>
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
							) : null}
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
						<div className="modal__left">
							<ReactTagInput 
								tags={post.tags} 
								onChange={(newTags) => setTagsHandler(newTags)} 
								maxTags={5}
								placeholder='теги'
								validator={
									(value) => {
										const validate = value.length > 16
										console.log(validate)
										if (validate) {
											alert('Количество символов в теге не должно превышать 16 символов')
										}
										return !validate
									}
								}
							/>
						</div>
						<div className="modal__right">
							<Button disabled={!validate} color="blue button-s" onClick={() => addPost()}>Создать</Button>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return null
	}
}

function mapStateToProps(state) {
	return {
		blogname: state.firebase.profile.blogname,
		username: state.firebase.auth.displayName
	}
}

export default connect(mapStateToProps)(CreateNote)