"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearToken } from "@/redux/sessionSlice"
import { deleteCookie } from "cookies-next"
import { useDispatch } from "react-redux"
import { HashLoader } from "react-spinners"

const Logout = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    //hapus token Redux
    dispatch(clearToken())

    //hapus token cookie
    deleteCookie("token")

    //redirect ke halaman login
    router.push("/login")
  }, [dispatch, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="#f13b2f" loading />
    </div>
  )
}

export default Logout
