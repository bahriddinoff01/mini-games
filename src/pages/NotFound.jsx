import { Link } from "react-router-dom"

const NotFound = () => (
  <main className="flex flex-col items-center px-4 py-24 text-center">
    <div className="mb-4 text-6xl">👾</div>
    <h1 className="text-3xl font-bold">Page not found</h1>
    <p className="mt-2 text-slate-500">This level doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">Back to all games</Link>
  </main>
)

export default NotFound
