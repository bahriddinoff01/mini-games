import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Todo from "./pages/Todo"
import GuessNumber from "./pages/GuessNumber"
import Rps from "./pages/Rps"
import TicTacToe from "./pages/TicTacToe"
import Memory from "./pages/Memory"
import Reaction from "./pages/Reaction"
import Typing from "./pages/Typing"
import WhackAMole from "./pages/WhackAMole"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/guess-number" element={<GuessNumber />} />
          <Route path="/rps" element={<Rps />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/reaction" element={<Reaction />} />
          <Route path="/typing" element={<Typing />} />
          <Route path="/whack-a-mole" element={<WhackAMole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
