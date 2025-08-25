import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import OptimizedImage from '../components/OptimizedImage'
import LoadingSkeleton from '../components/LoadingSkeleton'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors, doctorsLoading } = useContext(AppContext)
  const [currentDoctors, setCurrentDoctors] = useState([])

  useEffect(() => {
    if (speciality) {
      const filtered = doctors.filter(item => 
        item.speciality.toLowerCase() === speciality.toLowerCase()
      )
      setCurrentDoctors(filtered)
    } else {
      setCurrentDoctors(doctors)
    }
  }, [doctors, speciality])

  if (doctorsLoading) {
    return (
      <div className='p-6 md:p-10'>
        <div className='text-3xl font-bold text-gray-800 mb-8'>
          {speciality ? `${speciality} Doctors` : 'All Doctors'}
        </div>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
          <LoadingSkeleton type="card" count={12} />
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 md:p-10'>
      <div className='text-3xl font-bold text-gray-800 mb-8'>
        {speciality ? `${speciality} Doctors` : 'All Doctors'}
      </div>

      {/* Doctor Cards */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
        {currentDoctors.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white'
          >
            <OptimizedImage className='w-full h-48 object-cover bg-blue-50' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-green-500 text-xs mb-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-sm font-semibold'>{item.name}</p>
              <p className='text-gray-500 text-xs'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors
