import React from 'react'

export default function SuccessMsg(props) {
    const successStyle = {
        color: 'green',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 700,
    }
    return (
        <div style={successStyle}>
            {props.text}
        </div>
    )
}


