import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { signIn } from '../../../redux/actions/authActions'
import '../Modal.sass'
import is from 'is_js'
import Input from '../../UI/Input'
import Button from '../../UI/Button'
import { SHOW_MODAL } from '../../../redux/actions/actionsTypes'

function CreateAcc(props) {
    const [isFormValid, setFormValid] = useState(false)
    const [formControls, setControl] = useState([
        {
            value: '',
            type: 'email',
            placeholder: 'Email',
            errorMessage: 'Введите корректный email',
            valid: false,
            touched: false,
            validation: {
                required: true,
                email: true
            }
        },
        {
            value: '',
            placeholder: 'Никнейм',
            errorMessage: 'Введите верный ник',
            valid: false,
            touched: false,
            validation: {
                required: true,
                minLength: 1
            }
        },
        {
            value: '',
            placeholder: 'Название блога',
            errorMessage: 'Введите верное название блога',
            valid: false,
            touched: false,
            validation: {
                required: true,
                minLength: 1
            }
        },
        {
            value: '',
            type: 'password',
            placeholder: 'Пароль',
            errorMessage: 'Длина пароля должна быть не менее 6 символов',
            valid: false,
            touched: false,
            validation: {
                required: true,
                minLength: 6
            }
        },
    ])

    useEffect(() => {
        if (!props.isEmpty) {
            setFormValid(false)
            props.showModal()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isEmpty])

    function validate(value, validation) {
        if(!validation){
            return true
        }
        let isValid = true
        if(validation.required) {
            isValid = value.trim() !== '' && isValid
        }
        if(validation.email) {
            isValid = is.email(value) && isValid
        }
        if(validation.minLength) {
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    function onChangeHandler(event, controlName) {

        const formControls2 = { ...formControls}
        const control = { ...formControls2[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = validate(control.value, control.validation)

        formControls2[controlName] = control

        var FormValid = true

        Object.keys(formControls2).forEach(name => {
            FormValid = formControls2[name].valid && FormValid
        })

        setControl(formControls2)
        setFormValid(FormValid)
    }
    

    function renderInputs() {
        return Object.keys(formControls).map((controlName, index) => {
            const control = formControls[controlName]
            return (
                <Input 
                    key={index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    placeholder={control.placeholder} 
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => onChangeHandler(event, controlName)}
                    spanClassName={'modal-input'}
                />
            )
        })
    }

    function submitHandler(event) {
        event.preventDefault()
        const email = formControls[0].value
        const name = formControls[1].value
        const blogname = formControls[2].value
        const pass = formControls[3].value
        props.signIn(
            email,
            pass,
            true,
            name,
            blogname
        )
    }
    return (
        <CSSTransition
            in={props.isShow}
            timeout={300}
        >
            <Modal
                closeTimeoutMS={500}
                isOpen={props.isShow}
                className="modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'none',
                    },
                }}
            >
                <div className="modal__dialog mx-width">
                    <div className="modal__header">
                        <button onClick={ () => props.showModal() }>
                            <FontAwesomeIcon icon="times" className="times"/>
                        </button>
                    </div>
                    <svg viewBox="-1 -2 38 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30.0996 2.41364C32.8388 4.36574 34.2084 5.0815 30.442 7.94456C29.4148 8.7254 27.3605 10.222 24.9637 9.24595C20.9378 7.60649 18.3862 6.88856 14.007 6.96852C8.67952 7.06579 1.6438 11.5567 0.995939 10.8727C-2.08562 7.61921 11.2678 1.53947 14.007 0.786902C16.4038 0.128405 25.0436 -1.18957 30.0996 2.41364Z" fill="#F9F9F9"/>
                        <path d="M7.84387 26.8148C3.18818 24.4017 -1.22527 20.1661 0.311154 16.0783C2.02313 11.5234 7.23809 10.8727 7.50147 12.4994C8.18626 16.729 11.9346 19.4602 14.007 19.6571C20.8549 20.3078 25.9909 20.9585 30.442 24.212C32.8388 25.9638 35.578 28.7668 34.8932 36.9006C34.2084 45.0343 24.9637 49.9145 24.9637 47.9624C24.9637 46.661 31.3375 35.5992 25.6485 31.695C19.9594 27.7908 11.6102 28.7668 7.84387 26.8148Z" fill="#F9F9F9"/>
                        <path d="M16.0614 43.4075C20.5125 42.7568 23.9365 41.7808 23.9365 42.7568C23.9365 46.3356 19.8545 48.3734 15.3766 49.5891C10.583 50.8905 5.1047 48.9384 0.995945 46.0103C-1.35182 44.3371 4.45318 39.6983 6.13189 40.154C8.52866 40.8047 13.2423 43.8196 16.0614 43.4075Z" fill="#F9F9F9"/>
                        <path d="M30.0996 2.41364C32.8388 4.36574 34.2084 5.0815 30.442 7.94456C29.4148 8.7254 27.3605 10.222 24.9637 9.24595C20.9378 7.60649 18.3862 6.88856 14.007 6.96852C8.67952 7.06579 1.6438 11.5567 0.995939 10.8727C-2.08562 7.61921 11.2678 1.53947 14.007 0.786902C16.4038 0.128405 25.0436 -1.18957 30.0996 2.41364Z" stroke="#F9F9F9"/>
                        <path d="M7.84387 26.8148C3.18818 24.4017 -1.22527 20.1661 0.311154 16.0783C2.02313 11.5234 7.23809 10.8727 7.50147 12.4994C8.18626 16.729 11.9346 19.4602 14.007 19.6571C20.8549 20.3078 25.9909 20.9585 30.442 24.212C32.8388 25.9638 35.578 28.7668 34.8932 36.9006C34.2084 45.0343 24.9637 49.9145 24.9637 47.9624C24.9637 46.661 31.3375 35.5992 25.6485 31.695C19.9594 27.7908 11.6102 28.7668 7.84387 26.8148Z" stroke="#F9F9F9"/>
                        <path d="M16.0614 43.4075C20.5125 42.7568 23.9365 41.7808 23.9365 42.7568C23.9365 46.3356 19.8545 48.3734 15.3766 49.5891C10.583 50.8905 5.1047 48.9384 0.995945 46.0103C-1.35182 44.3371 4.45318 39.6983 6.13189 40.154C8.52866 40.8047 13.2423 43.8196 16.0614 43.4075Z" stroke="#F9F9F9"/>
                    </svg>
                    <h3>Регистрация</h3>
                    <form onSubmit={(event) => submitHandler(event)} className="modal__form" >
                        {renderInputs()}
                        <Button 
                            cls="primary button-l"
                            color="green"
                            disabled={!isFormValid}
                        >
                            Зарегистрироваться
                        </Button> 
                    </form>
                </div>
            </Modal>
        </CSSTransition>
    )
}

function mapStateToProps(state) {
    return {
        isShow: state.modal.isShow,
        isEmpty: state.firebase.auth.isEmpty
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signIn: (email, password, name, blogname, isLogin) => dispatch(signIn(email, password, name, blogname, isLogin)),
        showModal: () => dispatch({ type: SHOW_MODAL, modalType: 'CreateAcc' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAcc)