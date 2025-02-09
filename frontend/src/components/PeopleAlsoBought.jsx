import { useEffect, useState } from 'react'
import React from 'react'
import ProductCard from './ProductCard'
import axios from '../lib/axios'
import toast from 'react-hot-toast/headless'
import LoadingSpinner from './LoadingSpinner'
const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState()
  const [isLoading,setIsloading] = useState(true)
  useEffect(()=>{

    const fetchRecommedation = async()=>{
     try {
      const res = await axios.get("/products/recommendations")
     setRecommendations(res.data)
     setIsloading(false)
     } catch (error) {
      toast.error(error.response.data.message || "Error occurred while fetching reccomendations")
     }finally{
      setIsloading(false)
     }
    }
    fetchRecommedation()
  },[])
  if (isLoading)return <LoadingSpinner/>
  return <div className='mt-8'>
    
    <h3 className='text-2xl font-semibold text-emerald-400'>
       PeopleAlsoBought
    </h3>
    <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {recommendations.map((product)=>(
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
    </div>
  
}

export default PeopleAlsoBought