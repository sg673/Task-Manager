import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './pages/dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Profile from './pages/profile'
import Project from './pages/project'
import { useAuth } from './hooks/useAuth'
import Login from './pages/login'
import Register from './pages/register'
import { AuthProvider } from './contexts/authContext'


function ProtectRoute({children}: {children:React.ReactNode}){
  const {user,isLoading} = useAuth();
  if(isLoading) return <div>Loading...</div>;
  if(!user) return <Navigate to="/login"/>
  return <>{children}</>
}

function AppRoutes(){
  const {user} = useAuth();
  return (
    <>
      {user && <Navbar/>}
      <Toaster position='top-right' toastOptions={{duration:2000}}/>
      <Routes>
        <Route path="/">
          <Route path="login" element={user ? <Navigate to="/dashboard"/> : <Login/>}/>
          <Route path="register" element={user ? <Navigate to="/dashboard"/> : <Register/>}/>
          <Route path="dashboard" element={<ProtectRoute><Dashboard/></ProtectRoute>} />
          <Route path="projects" element={<ProtectRoute><Project/></ProtectRoute>} />
          <Route path="profile" element={<ProtectRoute><Profile/></ProtectRoute>}/>
        </Route>

      </Routes>
    </>
  );
}
/**
 * Main application component that sets up routing and global components
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>  
  )
}

export default App
