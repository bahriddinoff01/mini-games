import React from 'react'

const Navbar = () => {
  return (
    <>
        <nav className='flex justify-between px-10 py-4 items-center border-b-2 shadow-2xl'>
            <h1 className="text-2xl font-bold">Mini Games</h1>
            <div className="flex justify-center items-center gap-15">
                <div className="hidden list-parent text-xl md:flex justify-center items-center gap-10">
                    <li className="list-none"><a href="">Home</a></li>
                    <li className="list-none"><a href="">About</a></li>
                    <li className="list-none"><a href="">Contact Us</a></li>
                    <li className="list-none"><a href="">Ideas</a></li>
                </div>
                <div className='flex justify-center text-xl items-center gap-5'>
                    <button className='bg-black text-white border rounded-md px-4 py-2 hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200'>Sign In</button>
                    <button className='bg-black text-white border rounded-md px-4 py-2 hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-200'>Log In</button>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar