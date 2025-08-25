import React, { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { performanceMonitor } from './utils/performance'
import LoadingSkeleton from './components/LoadingSkeleton'

// Lazy load components for code splitting
const Home = React.lazy(() => import('./pages/Home'))
const Doctors = React.lazy(() => import('./pages/Doctors'))
const Login = React.lazy(() => import('./pages/Login'))
const About = React.lazy(() => import('./pages/About'))
const Contact = React.lazy(() => import('./pages/Contact'))
const MyProfile = React.lazy(() => import('./pages/MyProfile'))
const MyAppointments = React.lazy(() => import('./pages/MyAppointments'))
const Appointment = React.lazy(() => import('./pages/Appointment'))
const Navbar = React.lazy(() => import('./components/Navbar'))
const Footer = React.lazy(() => import('./components/Footer'))

const App = () => {
    useEffect(() => {
        // Initialize performance monitoring
        performanceMonitor.trackPageLoad();
        performanceMonitor.monitorMemory();
    }, []);

    return (
        <div className='mx-4 sm:mx-[10%]'>
            <ToastContainer />
            <Suspense fallback={<LoadingSkeleton type="text" count={3} />}>
                <Navbar />
            </Suspense>

            {/* Content Wrapper with padding to avoid overlap */}
            <div className='pt-[90px]'>
                <Suspense fallback={<LoadingSkeleton type="card" count={6} />}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/doctors' element={<Doctors />} />
                        <Route path='/doctors/:speciality' element={<Doctors />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/my-profile' element={<MyProfile />} />
                        <Route path='/my-appointments' element={<MyAppointments />} />
                        <Route path='/appointment/:docId' element={<Appointment />} />
                    </Routes>
                </Suspense>

                <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
                    <Footer />
                </Suspense>
            </div>
        </div>
    )
}

export default App
