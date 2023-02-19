import React, { createContext, useEffect, useContext, useReducer, useState } from 'react';
import './App.css';
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { initialState, reducer } from './reducers/userReducer';
import Navbar from './components/Navbar';
import SignIn from './components/screens/SignIn';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import Profile from './components/screens/Profile';
import UserProfile from './components/screens/UserProfile';
import SubscribeUserPosts from './components/screens/SubscribeUserPosts';
export const UserContext = createContext()



const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate('/signin')
    }
  }, [])
  return (
    <Routes>
      <Route exact path='/' element={<Home />}>
      </Route>
      <Route path='/signin' element={<SignIn />}>
      </Route>
      <Route path='/signup' element={<Signup />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/create' element={<CreatePost />} />
      <Route path='/profile/:userid' element={<UserProfile />} />
      <Route path='/myfollowingpost' element={<SubscribeUserPosts />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log('state in app is', state)
  return (
    <UserContext.Provider value={{ state, dispatch }} >
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
