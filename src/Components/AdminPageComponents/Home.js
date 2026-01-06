import React from 'react'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

  const showToast = () => {
    toast.success("hererrererere", {
      position: "bottom-left",
      autoClose: 800,
      closeOnClick: true,
      theme: "dark",
    });
  }

  return (
    <div className='admin-page'>

      Hii  this is the home page for admin

    </div>
  )
}

export default Home