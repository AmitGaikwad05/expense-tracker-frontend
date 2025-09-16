import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Main from "./components/Main.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Dashboard from "./components/Dashboard.jsx"
import UserProfile from "./components/UserProfile.jsx"
import Earnings from "./components/Earnings.jsx"
import Expenses from "./components/Expenses.jsx"
import About from "./components/About.jsx"
import PageNotFound from "./components/PageNotFound.jsx"

import myStore from "./store/store.js"

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'


const Router= createBrowserRouter([
  {path: "/", element: <App/>, children: [ 
    {path: "/", element: <Main/>},
    {path: "/login", element: <Login/> }, 
    {path: "/signup", element: <Signup/> },
    {path: "/about", element: <About/> }, 
    {path: "/dashboard", element: <Dashboard/> } ,
    {path: "/userprofile", element: <UserProfile/> } ,
    {path: "/earnings", element: <Earnings/> }, 
    {path: "/expenses", element: <Expenses/> } 
  ]},
  {path: "*", element: <PageNotFound/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={myStore}>
  <RouterProvider router={Router}/>
  </Provider>
  </StrictMode>
)
