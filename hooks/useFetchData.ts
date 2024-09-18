import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  setBalance,
  setBanners,
  setProfile,
  setServices,
} from "@/redux/informationSlice"
import { setToken } from "@/redux/sessionSlice"
import { RootState } from "@/redux/store"
import axios from "axios"
import { parseCookies } from "nookies"
import { useDispatch, useSelector } from "react-redux"

export const useFetchData = () => {
  //hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const cookies = parseCookies()
  const cookieToken = cookies.token || null

  const token = useSelector((state: RootState) => state.session.token)
  const profile = useSelector((state: RootState) => state.information.profile)
  const balance = useSelector((state: RootState) => state.information.balance)
  const services = useSelector((state: RootState) => state.information.services)
  const banners = useSelector((state: RootState) => state.information.banners)

  const [loading, setLoading] = useState(true)

  //helper fetch data
  const fetchFromApi = async (endpoint: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token || cookieToken}`,
          },
        }
      )
      return data
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  //profile
  const handleFetchProfile = async () => {
    if (!profile) {
      const data = await fetchFromApi("/profile")
      dispatch(setProfile(data.data))
    }
  }

  //balance
  const handleFetchBalance = async () => {
    const data = await fetchFromApi("/balance")
    dispatch(setBalance(data.data.balance))
  }

  //services
  const handleFetchServices = async () => {
    const data = await fetchFromApi("/services")
    console.log(data.data)
    dispatch(setServices(data.data))
  }

  //banners
  const handleFetchBanners = async () => {
    const data = await fetchFromApi("/banner")

    dispatch(setBanners(Object.values(data.data)))
  }

  //fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        !profile ? handleFetchProfile() : Promise.resolve(),
        balance === null ? handleFetchBalance() : Promise.resolve(),
        services.length === 0 ? handleFetchServices() : Promise.resolve(),
        banners.length === 0 ? handleFetchBanners() : Promise.resolve(),
      ])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  //main useeffect
  useEffect(() => {
    const initializeFetch = async () => {
      if (!cookieToken) {
        router.push("/login")
        return
      }

      if (!token) {
        dispatch(setToken(cookieToken))
      }

      if (
        !profile ||
        balance === null ||
        services.length === 0 ||
        banners.length === 0
      ) {
        await fetchData()
      } else {
        setLoading(false)
      }
    }

    initializeFetch()
  }, [
    token,
    cookieToken,
    profile,
    balance,
    services,
    banners,
    dispatch,
    router,
  ])

  return { loading, profile, balance, services, banners }
}
