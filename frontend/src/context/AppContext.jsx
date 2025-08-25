import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext=createContext()

const AppContextProvider=(props)=>{

    const currencySymbol="₹"
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [doctorsLoading, setDoctorsLoading] = useState(true)
    
    // Cache for API responses
    const cache = new Map()
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    const getCachedData = (key) => {
        const cached = cache.get(key)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data
        }
        return null
    }

    const setCachedData = (key, data) => {
        cache.set(key, {
            data,
            timestamp: Date.now()
        })
    }

    const getDoctorsData = async () => {
        try {
            setDoctorsLoading(true)
            
            // Check cache first
            const cachedDoctors = getCachedData('doctors')
            if (cachedDoctors) {
                setDoctors(cachedDoctors)
                setDoctorsLoading(false)
                return
            }

            const {data} = await axios.get(backendUrl + '/api/doctor/list', {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Cache-Control': 'max-age=300' // 5 minutes cache
                }
            })
            
            if (data.success) {
                setDoctors(data.doctors)
                setCachedData('doctors', data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Failed to load doctors')
        } finally {
            setDoctorsLoading(false)
        }
    }

    const loadUserProfileData = async () => {
        try {
            setLoading(true)
            
            // Check cache first
            const cachedUserData = getCachedData('userData')
            if (cachedUserData) {
                setUserData(cachedUserData)
                setLoading(false)
                return
            }

            const {data} = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: {token},
                timeout: 10000
            })
            
            if (data.success) {
                setUserData(data.userData)
                setCachedData('userData', data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const clearCache = () => {
        cache.clear()
    }

    const value ={
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
        loading,
        doctorsLoading,
        clearCache
    }
    
    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
            setLoading(false)
        }
    },[token])
    
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;