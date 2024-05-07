import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ children }) => {
  const navigate = useNavigate()
  const dataString = window.localStorage.getItem("")
  const dataObj = JSON.parse(dataString)
  const token = dataObj?.token
  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập ở đây, ví dụ sử dụng Redux hoặc Context API
    const isLoggedIn = false // Cần triển khai hàm này

    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      navigate('/login')
    }
  }, [navigate])

  return <>{children}</>
}

export default RequireAuth
