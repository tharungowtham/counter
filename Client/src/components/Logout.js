import React,{useEffect} from 'react'
import axios from 'axios'

function Logout() {
    const handleLogout = async () => {
        try {
            await axios.post(`http://localhost:5000/auth/logout`,null, {withCredentials: true})
            window.location.assign('/')
        } catch (err) {
            console.error(err)
        }
    }
    useEffect(()=>{
        handleLogout();
    },[])
  return (
    <></>
  )
}

export default Logout