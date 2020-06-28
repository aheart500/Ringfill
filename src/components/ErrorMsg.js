import React from 'react'

export default function ErrorMsg(props) {
    const errorStyle = {
        color: 'red',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 700,
}
return (
    <div style={errorStyle}>
        {props.text}
    </div>
)
}


