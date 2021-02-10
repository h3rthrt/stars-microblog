import React, { useState, useEffect, useRef } from 'react'
import './PhotoUser.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ViewPhoto from '../../../../components/Modal/ViewPhoto'

function Photo(props) {

    const [showMenu, setShowMenu] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [image, setImage] = useState({
        base64: '',
        alt: '',
        files: ''
    })
    const buttonUpdateRef = useRef()
    const inputImageRef = useRef()

    const buttonUpdateNode = buttonUpdateRef.current

    useEffect(() => {
        function beforeComponentClick(event) {
            if(event.target.className !== 'photo-user__update show') {
                setShowMenu(false)
                buttonUpdateNode.classList.remove('show')
            }
        }
        if (showMenu) {
            inputImageRef.current.addEventListener('change', changeHandler)
            document.addEventListener('click', beforeComponentClick)
            return () => {
                document.removeEventListener('click', beforeComponentClick)
            }
        }
    }, [showMenu, buttonUpdateNode])

    function changeHandler(event) {
        if(!event.target.files.length) {
            return
        }
        
        const files = Array.from(event.target.files)
        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()
            reader.onload = ev => {
                setImage((prevState) => {
                    return {
                        ...prevState,
                        base64: ev.target.result,
                        alt: file.name,
                        files: Array.from(event.target.files)
                    }
                })
            }
            reader.readAsDataURL(file)
        })  
        setShowModal(true)
    }

    function clickHandler() {
        
    }

    function updatePhotoHandler() {
        const buttonUpdateNode = buttonUpdateRef.current
        if(!showMenu) {
            setShowMenu(true)
            buttonUpdateNode.classList.add('show')
        } else {
            setShowMenu(false)
            buttonUpdateNode.classList.remove('show')
        }
    }

    function closeModalHandler() {
        setTimeout(() => {
            setShowModal(false)
            setImage({
                base64: '',
                alt: '',
                files: ''
            })
        }, 100)
    }

    return (
        <div className="photo-user">
            <ViewPhoto 
                blogname={props.blogname} 
                image={image} 
                view={showModal}
                onClose={() => closeModalHandler()}
            />
            {
                props.photoUser !== 'null' || undefined
                    ? <img alt="" src="/img/defaultPhoto.svg" />
                    : <img className="photo-user__img" alt="" src={props.photoUser} onClick={() => clickHandler()}/>
            }
            {
                props.username === props.authUser 
                    ? <button ref={buttonUpdateRef} className="photo-user__update" onClick={() => updatePhotoHandler()}>
                        <FontAwesomeIcon icon="camera" />
                        Обновить фото
                    </button>
                    : null
            }
            {
                showMenu ? 
                    <ul className="photo-user__menu">
                        <li>
                            <button className="photo-user__replace" onClick={() => inputImageRef.current.click()}>Заменить фото</button>
                            <input ref={inputImageRef} type="file" accept="image/jpeg,image/pjpeg,image/gif,image/png" />
                        </li>
                        <li>
                            <button className="photo-user__remove">Удалить фото</button>
                        </li>
                    </ul>
                    : null
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.username,
        blogname: state.profile.blogname
    }
}

export default connect(mapStateToProps)(Photo)