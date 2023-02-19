import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'

const SubscribeUserPosts = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    console.log('data', data)
    console.log('state', state)
    useEffect(() => {
        fetch('/post/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        console.log('post like', id)
        fetch('/post/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log('result of like post')
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                console.log('new data in likes', newData)
                setData(newData)
            })
            .catch(err => {
                console.log(err)
            })

    }
    const unlikePost = (id) => {
        fetch('/post/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item
                    }
                })
                setData(newData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/post/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })

    }

    const deletePost = (postid) => {
        fetch(`/post/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='home'>
            {
                data.map(item => {
                    return (
                        <div className='card home-card' key={item._id}>
                            <h5 style={{ padding: '5px' }} ><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
                                {item.postedBy._id == state._id && <i className='material-icons' style={{
                                    float: 'right'
                                }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>
                                }
                            </h5>
                            <div className='card-image'>
                                <img src={item.photo} />
                            </div>
                            <div className='card-content' style={{ cursor: 'pointer' }}>
                                <i className='material-icons' style={{ color: 'red' }}>favorite</i>
                                {item.likes.includes(state._id)
                                    ? <i className="material-icons"
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    : <i className='material-icons'
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>
                                }
                                <h6>{item.likes.length}</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: '500' }}>{record.postedBy}</span>{record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment..." />
                                </form>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SubscribeUserPosts