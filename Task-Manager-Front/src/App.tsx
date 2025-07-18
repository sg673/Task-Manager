import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './pages/dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Profile from './pages/profile'


/**
 * Main application component that sets up routing and global components
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Toaster position='top-right' toastOptions={{duration:2000}}/>
      <Routes>
        <Route path="/">
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="projects" element={<div>Project Page (WIP)</div>} />
          <Route path="profile" element={<Profile/>}/>

        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
