import React, { useContext, useEffect, useRef, useState } from 'react'
import M from 'materialize-css'
import { UserContext } from '../App'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    console.log('user details', userDetails)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if (state) {
            return [
                <div>
                    <li key="1"><i data-target="modal1" className='large material-icons modal-trigger' style={{ color: 'black' }}>search</i></li>
                    <li key="2"><Link to='/profile'>Profile</Link></li>
                    <li key="3"><Link to='/create'>Create</Link></li>
                    <li key="4"><Link to='/myfollowingpost'>My following Posts</Link></li>
                    <li key="5">
                        <button className="btn #c62828 red darken-3"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({ type: 'CLEAR' })
                                navigate('/signin')
                            }}>Logout</button>
                    </li>
                </div>
            ]
        } else {
            return [
                <div>
                    <li key='6'><Link to='/signin'>Signin</Link></li>
                    <li key='7'><Link to='/signup'>Signup</Link></li>
                </div>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/user/search-users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }

    return (
        <nav>
            <div className='nav-wrapper white'>
                <Link to={state ? '/' : '/signin'} className='brand-logo left'>Instagram</Link>
                <ul id="nav-mobile" className='right'>
                    {renderList()}
                </ul>
            </div>
            <div id='modal1' className='modal' ref={searchModal} style={{ color: 'black', cursor: 'pointer' }} >
                <div className='modal-content' style={{ cursor: 'pointer' }}>
                    <input
                        type='text'
                        placeholder='search users'
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item">{item.email}</li></Link>
                        })}
                    </ul>
                </div>
                <div className='modal-footer'>
                    <button className='modal-close waves-effect waves-green btn-flat' onClick={() => setSearch('')}>close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar