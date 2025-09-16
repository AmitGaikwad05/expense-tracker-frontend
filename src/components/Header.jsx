import { NavLink } from "react-router-dom";

const Header = () => {
  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggleSidebar"));
    }
  };

  return (
    <div className='shadow-md border border-gray-200 w-full p-4 md:p-5 flex items-center gap-3 justify-between'>

<NavLink to="/" className="flex items-center gap-4">
<img src="/expense-tracker-logo.png" alt="" width={"40px"} />
    <h1 className="text-xl md:text-2xl font-semibold text-green-800">Expense Tracker</h1>
</NavLink>

    <button
      aria-label="Toggle menu"
      className="md:hidden p-2 rounded hover:bg-gray-100 active:bg-gray-200 transition"
      onClick={handleMenuClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    </div>
  )
}

export default Header