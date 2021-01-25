import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./../Modal.sass"

function Modal() {
    return (
        <div className="modal">
                <div className="modal__dialog">
                    <input placeholder="Заголовок" className="modal__header" />
                    <hr />
                    <input placeholder="Текст" className="modal__text" />
                    <hr />
                    <FontAwesomeIcon icon="photo-video" size="1x" />
                    <FontAwesomeIcon icon="file-audio" size="1x" />
                    <div className="modal__footer">
                        <div className="modal__left">

                        </div>
                        <div className="modal__right">
                            
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
