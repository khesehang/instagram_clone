import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'
import axios from 'axios'
const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'Invalid Email', classes: "#c62828 red darken-3" })
            return
        }
        fetch('/auth/signin', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email,
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {
                    console.log('token ',data.token)
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.User))
                    dispatch({ type: "user", payload: data.User })
                    M.toast({ html: 'SignedIn Success', classes: '#43a047 green darken-1' })
                    navigate('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='mycard'>
            <div className='card auth-card input-field'>
                <h2>Instagram</h2>
                <input
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                    onClick={() => PostData()}
                >Login</button>
                <h5><Link to='/signup'>Don't have an account ?</Link></h5>
                <h6><Link to='/reset'>Forgot password ?</Link></h6>
            </div>
        </div>
    )
}

export default SignIn