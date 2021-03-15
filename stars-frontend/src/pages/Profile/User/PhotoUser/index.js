import React, { useState, useEffect, useRef } from 'react'
import './PhotoUser.sass'
import { connect } from 'react-redux'
import { clearPhoto } from '../../../../redux/actions/profileActions'
import { useFirebase } from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ViewPhoto from '../../../../components/Modal/ViewPhoto'
import WarningMsg from '../../../../components/Modal/WarningMsg'

function Photo(props) {
    const firebase = useFirebase()
    const [showMenu, setShowMenu] = useState(false) //for show menu with buttons
    const [showModal, setShowModal] = useState(false) //for update img
    const [showWarning, setShowWarning] = useState(false) //warning modal for remove img
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

    function clickImageHandler() {

    }

    function clickInputHandler() {
        if(image) {
            setImage({
                base64: '',
                alt: '',
                files: ''
            })
        }
        inputImageRef.current.click()
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

    function removePhoto() {
        firebase.ref(`users/${props.uid}/photoURL`).remove()
        const photoName = firebase.storage().refFromURL(props.photoURL).name
        firebase.deleteFile(`${props.authUser}/profilePhoto/${photoName}`)
        const user = firebase.auth().currentUser
        user.updateProfile({
            'photoURL': ''
        })
        firebase.updateAuth({
            'photoURL': ''
        })
        props.clearPhoto()
    }

    return (
        <div className="photo-user">
            {
                showWarning ?
                    <WarningMsg 
                        msg="Вы уверены?"
                        accept="Удалить"
                        onShow={() => setShowWarning(!showWarning)}
                        action={() => removePhoto()}
                    />
                    : null
            }
            <ViewPhoto 
                blogname={props.blogname} 
                image={image} 
                view={showModal}
                onClose={() => closeModalHandler()}
            />
            <div className="photo-user__img-block">
                {
                    !props.photoURL
                        ? <img alt="" src="/img/defaultPhoto.svg" />
                        : <img className="photo-user__img" alt="" src={props.photoURL} onClick={() => clickImageHandler()}/>
                }
            </div>
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
                            <button className="photo-user__replace" onClick={() => clickInputHandler()}>Заменить фото</button>
                            <input onChange={(event) => changeHandler(event)} ref={inputImageRef} type="file" accept="image/jpeg,image/pjpeg,image/gif,image/png" />
                        </li>
                        {
                            props.photoURL ?
                            <li>
                                <button className="photo-user__remove" onClick={() => setShowWarning(!showWarning)}>Удалить фото</button>
                            </li>
                            : null
                        }
                    </ul>
                    : null
            }
        </div>
    )
}

function mapStateToProps(state) {
    console.log(state)
    return {
        authUser: state.firebase.profile.username,
        blogname: state.profile.blogname,
        uid: state.firebase.auth.uid,
        photoURL: state.firebase.auth.photoURL
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clearPhoto: () => dispatch(clearPhoto())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo)