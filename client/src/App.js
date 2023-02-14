import {  createContext, useContext, useEffect, useReducer } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { initialState, reducer } from './reducers/userReducer';
import Navbar from './components/Navbar';
import SignIn from './components/screens/SignIn';
import { restart } from 'nodemon';
export const UserContext = createContext()

const Home = () => {
  return (
    <div className="home" style={{marginTop: '50px'}}>
    <h1>Home</h1>
    </div>
  )
}


const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user })
    } else {
      // if (!navigate.location.pathname.startsWith("/reset"))
        navigate('/signin')
    }
  }, [])
  return (
    <Routes>
      <Route exact path='/' >
      </Route>
      <Route path='/signin' >
      hello
      </Route>
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
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
