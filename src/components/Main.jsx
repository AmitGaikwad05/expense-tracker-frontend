import React from "react";
import { NavLink } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-5">
  <div className="max-w-4xl flex flex-col items-center gap-2 p-10">
<NavLink to="/signup" >
<h2 className="text-5xl font-semibold text-green-500  hover:scale-110 transition-all m-4" >Manage your money the smart way.</h2>
</NavLink>
<p className="text-green-600 text-center">Expense Tracker is a simple yet powerful tool that helps you monitor and understand your spending habits. Add and organize expenses by category, and instantly see where your money goes with easy-to-read charts and summaries.

With monthly trends, total spending insights, and a responsive design that works on any device, you’ll always stay on top of your finances.
</p>
<h3  className="text-2xl font-semibold text-green-600 " >
Login or Sign up to start tracking your expenses today.
</h3>
</div>

      <div>
        <NavLink className="m-2.5 bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-2.5 rounded-lg transition text-lg" to="/login">Login</NavLink>
        <NavLink className="m-2.5 bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-2.5 rounded-lg transition text-lg"  to="/signup">Signup</NavLink>
      </div>
    </div>
  );
};

export default Main;
