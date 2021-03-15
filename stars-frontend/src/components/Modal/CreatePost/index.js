import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./../Modal.sass"
import Button from '../../UI/Button'

function CreateNote(props) {
    const inputImageRef = useRef()
    const [image, setImage] = useState({images: []})


    function changeHandler(event) {
        if(!event.target.files.length) {
            return
        }
        const files = Array.from(event.target.files)
        files.forEach((file, index) => {
            if (!file.type.match('image')) {
                return
            }
            const reader = new FileReader()
            reader.onload = ev => {
                setImage((prevState) => {
                    return {
                        images: [...prevState.images, 
                            {
                                base64: ev.target.result,
                                alt: file.name,
                                files: Array.from(event.target.files)
                            }
                        ]
                    }
                })
            }
            reader.readAsDataURL(file)
        })
    }

    function clickInputHandler() {
        console.log(image.images.length)
        if(image.images.length) {
            setImage({images: []})
        }
        inputImageRef.current.click()
    }

    if(props.view) {
        return (
            <div className="modal">
                    <div className="modal__dialog">
                        <div className="modal__header">
                            <button onClick={() => props.onShow()}>
                                <FontAwesomeIcon icon="times" className="times"/>
                            </button>
                        </div>
                        <div className="modal__create">
                            <input placeholder="Заголовок" className="modal__header" />
                            <hr />
                            <div className="post__images">
                                { image.images.length ? (
                                    image.images.map((image, index) => {
                                        console.log('a')
                                        return (
                                            <div className="img-box" key={index} >
                                                <img alt={image.alt} src={image.base64}/>
                                            </div>
                                        )
                                    }) 
                                ) 
                                : null }
                                {/* <div className="img-box" >
                                    <img alt="" src="https://64.media.tumblr.com/f97493058d2010f90cf1030b8096e052/8ea939676c3d758b-a0/s2048x3072/dceacaf12ac10561182626e008846d614b5d7912.jpg"/>
                                </div>
                                <div className="img-box" >
                                    <img alt="" src="https://64.media.tumblr.com/55f0cbc15e7b37a4ab70326c6b04990f/9c42c28414223682-28/s2048x3072/36c50a7cc7ec22d17e7e9fbaea2e126115388570.jpg"/>
                                </div> */}
                            </div>
                            <textarea placeholder="Текст" maxLength="140" className="modal__text" />
                            <hr />
                            <button onClick={() => clickInputHandler()} >
                                <FontAwesomeIcon icon="photo-video" />
                            </button>
                            <input className="input-image"
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
                                <p>#теги</p>
                            </div>
                            <div className="modal__right">
                                <Button color="blue button-l">Создать</Button>
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
