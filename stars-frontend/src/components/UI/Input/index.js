import React from 'react'
import "./Input.sass"

function index(props) {
    const inputType = props.type || 'text'
    const cls = ['input']
    const inputCls = []
    const spanCls = []
    const htmlFor = `${inputType}-${Math.random()}`

    function isInvalid({valid, touched, shouldValidate}) {
        return !valid && shouldValidate && touched
    }

    isInvalid(props) && inputCls.push('error')
    props.border && inputCls.push(props.border)
    props.spanClassName && spanCls.push(props.spanClassName)
    
    return (
        <div className={cls.join(' ')}>
            { isInvalid(props) 
                ? <span className={ spanCls.join(' ') }>{ props.errorMessage || 'Введите верное значение' }</span> 
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
