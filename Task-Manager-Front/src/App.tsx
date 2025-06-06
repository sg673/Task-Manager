import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './pages/dashboard'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/navbar'


function App() {
  

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Toaster position='top-right' toastOptions={{duration:2000}}/>
      <Dashboard></Dashboard>
    </BrowserRouter>
    </>
  )
}

export default App
