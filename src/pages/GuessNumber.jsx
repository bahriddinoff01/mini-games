import React, { useRef } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GuessNumber = () => {
  const [targetNumber, setTargetNumber] = useState(()=>Math.floor(Math.random()*1000) +1)
  const [guess, setGuess] = useState("")
  const [attemptsLeft, setAttemptsLeft] = useState(7)
  const [message, setMessage] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [guessHistory, setGuessHistory] = useState([])
  const inputRef = useRef(null)
  const handleGuess = () => {
    const numericGuess = parseInt(guess)
    const newAttemptsLeft = attemptsLeft - 1
    setAttemptsLeft(newAttemptsLeft)
    let justWon = false
    if (targetNumber == numericGuess) {
      const newEntry = { id: Date.now(), guess: numericGuess, feedback: "You got it" }
      setGuessHistory([...guessHistory, newEntry])
      setGuess("")
      justWon = true
      setGameOver(true)
    }
    else if(targetNumber > numericGuess) {
      const newEntry = { id: Date.now(), guess: numericGuess, feedback: "Try higher value" }
      setGuessHistory([...guessHistory, newEntry])
      setGuess("")
    }
    else if (targetNumber < numericGuess){
      const newEntry = { id: Date.now(), guess: numericGuess, feedback: "Try lower value" }
      setGuessHistory([...guessHistory, newEntry])
      setGuess("")
    }
  
    if(newAttemptsLeft == 0 && justWon == false){
      const newEntry = { id: Date.now(), guess: numericGuess, feedback: `Game over. The number was ${targetNumber}` }
      setGuessHistory([...guessHistory, newEntry])
      setGuess("")
      setGameOver(true)
    }
    inputRef.current.focus()
  }
  const handleReset = () =>{
    setTargetNumber(Math.floor(Math.random () *1000 ) +1)
    setGuess("")
    setAttemptsLeft(7)
    setGameOver(false)
    setGuessHistory([])
  }
  return (
    <div className="min-h-screen flex justify-center items-start pt-24 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Guess the Number
        </h1>
        <p className="text-center text-gray-500 mb-6">
          You have {attemptsLeft} tries left.
        </p>

        <div className="flex gap-5 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e)=> setGuess(e.target.value)}
            placeholder='Guess a number'
            className='flex-1 px-4 py-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-gray-900 transition-all'
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGuess()
              }
            }}
            disabled={gameOver}
          />
          <div className="flex gap-5">
             <button
            onClick={handleGuess}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 active:scale-95 transition-all"
            disabled={gameOver}
          >
            Guess
          </button>
           <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 active:scale-95 transition-all"
            
          >
            Reset
          </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {guessHistory.map((entry, index) => {
              const isLatest = index === guessHistory.length - 1
              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={isLatest ? { opacity: 0, y: -10, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm ${
                    isLatest
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  <span className="font-medium">{entry.guess}</span>
                  <span className="text-sm">{entry.feedback}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {guessHistory.length === 0 && (
            <p className="text-center text-gray-400 mt-8">
              Make your first guess above.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuessNumber