import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Hero from "../components/Hero"
import ActivityGrid from "../components/ActivityGrid"

const Home = () => {
  const { hash } = useLocation()

  // Support links like "/#games" from other pages.
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
  }, [hash])

  return (
    <>
      <Hero />
      <ActivityGrid />
    </>
  )
}

export default Home
