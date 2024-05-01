import React from 'react'
import { useNavigate } from "react-router-dom"
function Redirect(props) {
    const navigate = useNavigate();
    navigate(props.to);
  return (
    <></>
  )
}

export default Redirect