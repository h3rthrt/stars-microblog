import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTagInput from '@pathofdev/react-tag-input'
import './../Modal.sass'
import Button from '../../UI/Button'

function CreateNote(props) {
	const inputImageRef = useRef()
	const [ image, setImage ] = useState({ images: [] })
    const [ post, setPost ] = useState({
        header: '',
        text: '',
        tags: []
    })

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
						<input placeholder="Заголовок" className="modal__header" />
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
						<textarea placeholder="Текст" maxLength="140" className="modal__text" />
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
                            />
						</div>
						<div className="modal__right">
							<Button color="blue button-s">Создать</Button>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return null
	}
}

export default CreateNote
