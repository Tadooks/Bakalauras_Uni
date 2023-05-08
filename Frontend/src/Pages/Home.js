import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/shop');
  }, [navigate]);

  return (
    <div>
      Navigating to shop!
    </div>
  )
}

export default Home;