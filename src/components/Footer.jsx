import React from 'react'

const Footer = () => {
  return (
    <div className='bg-gray-200 text-gray-600 w-full px-3 py-3 gap-1 md:p-3 flex items-center justify-center text-sm md:text-base gap-1 md:gap-1'>
      
      <div>© {new Date().getFullYear()} Expense Tracker -  </div> 
      
      <a className='text-green-600' href="https://transergllp.com/" target='_blank' >Transerg LLP</a></div>
  )
}

export default Footer