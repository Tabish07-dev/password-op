import React from 'react'

const navbar = () => {
  return (
    <nav className='bg-slate-800 text-white '>
      <div className="mycontainer flex justify-between items-center px-4 py-10 h-12">

      <div className='logo font-bold text-2xl'>
       <span className='text-green-700'>&lt;</span>
pass
<span className='text-green-700'>OP/&gt;</span>
      </div>
        {/* <ul>
            <li className='flex gap-4 '>
                <a className='hover:font-bold' href="/">home</a>
                <a className='hover:font-bold'  href="#">about</a>
                <a className='hover:font-bold'  href="#">contact</a>
            </li>
        </ul> */}
        <button className='text-white bg-green-700 my-5 rounded-full flex justify-between items-center'>
            <img className='invert w-10 p-1' src="/icons/github.png.png" alt="githublogo" />
            <span className='font-bold px-2'>GitHub</span>

        </button>
        </div>
      
    </nav>
  )
}

export default navbar
