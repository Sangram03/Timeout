
import React from 'react'

function Box({ boxData }) {
  return (
    <div
      className='group min-h-34 rounded-lg border border-gray-100 bg-red-950/30 p-5 text-white shadow-[0_18px_50px_rgba(239,68,68,0.18)] transition duration-200 hover:border-red-500/60 hover:bg-red-950/50'
    >
      <p className='font-poppins text-sm tracking-[0.1em] text-red-300'>
        {boxData.title}
      </p>

      <p className='mt-3 font-poppins text-3xl font-semibold tracking-normal text-red-500'>
        {boxData.time}
      </p>
    </div>
  )
}

export default Box

