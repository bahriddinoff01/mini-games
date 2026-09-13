import './App.css'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Todo from './pages/Todo'
import GuessNumber from './pages/GuessNumber'
import Rps from './pages/rps'


function App() {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Todo' element={<Todo />} />
        <Route path='/GuessNumber' element={<GuessNumber />} />
        <Route path='/Rps' element={<Rps />} />
      </Routes>
    </>
  )
}

export default App
