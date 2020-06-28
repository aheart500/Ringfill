import React, { useContext } from 'react'
import UserContext from './context/userContext/UserContext'
import { Redirect, Route } from 'react-router-dom';

export default function ProtectedRoute({component: Component, ...rest}) {
    const { userState } = useContext(UserContext);
    return (
        <Route {...rest} render={(props) => (userState.isLoggedIn || window.location.pathname=="/recharge" || localStorage.getItem('user')!==null) ? <Component {...props} /> : <Redirect to='/' />} />
    )
}
