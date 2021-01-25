import React from 'react'
import "./Input.sass"

function index(props) {
    const inputType = props.type || 'text'
    const cls = ['input']
    const inputCls = []
    const htmlFor = `${inputType}-${Math.random()}`

    function isInvalid({valid, touched, shouldValidate}) {
        return !valid && shouldValidate && touched
    }

    if (isInvalid(props)) {
        inputCls.push('error')
    }

    if (props.border) {
        inputCls.push(props.border)
    }
    
    return (
        <div className={cls.join(' ')}>
            { isInvalid(props) 
                ? <span>{props.errorMessage || 'Введите верное значение'}</span> 
                : null
            }
            
            <input 
                className={inputCls.join(' ')}
                type={inputType}
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
        </div>
    )
}

export default index
