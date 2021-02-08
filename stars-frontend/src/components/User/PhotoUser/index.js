import React, { useState } from 'react'
import './PhotoUser.sass'
import { connect } from 'react-redux'

function Photo(props) {

    const [showMenu, setShowMenu] = useState(false)
    
    //todo передать пропсами userid и получить аву, если юзер айди совпадает с авторизованным, отобразить меню заугрзки

    function clickHandler() {
        console.log(`props.userId: ${props.userId} !== authId: ${props.uid}`)
        
    }

    function updatePhotoHandler() {
        if(!showMenu) {
            setShowMenu(true)
        } else {
            setShowMenu(false)
        }
    }

    return (
        <div className="photo">
                {
                    props.photoUser !== 'null' || undefined
                        ? <img alt="" src="/img/defaultPhoto.svg" />
                        : <img className="photoUser" alt="" src={props.photoUser} onClick={() => clickHandler()}/>
                }
                {
                    props.userId === props.uid 
                        ? <button className="photoUpdate" onClick={() => updatePhotoHandler()}>Обновить фото</button>
                        : null
                }
                {
                    showMenu ? 
                        <ul className="photoMenu">
                            <li>
                                <button className="photoMenu__replace">Заменить фото</button>
                                <input type="file" accept="image/jpeg,image/pjpeg,image/gif,image/png" />
                            </li>
                            <li>
                                <button className="photoMenu__remove">Удалить фото</button>
                            </li>
                        </ul>
                        : null
                }
        </div>
    )
}

// function mapDispathToProps(dispatch) {
//     return {
//         upload: () => dispatch(upload())
//     }
// }

function mapStateToProps(state) {
    return {
        uid: state.auth.uid,
        photoURL: state.auth.photoURL
    }
}

export default connect(mapStateToProps)(Photo)
