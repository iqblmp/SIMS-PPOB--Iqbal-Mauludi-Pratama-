"use client"

import "swiper/css"
import { useEffect, useState } from "react"
import Image from "next/image"
import { setBalance } from "@/redux/informationSlice"
import { RootState } from "@/redux/store"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { HashLoader } from "react-spinners"
import { Swiper, SwiperSlide } from "swiper/react"

import { Service } from "@/types/ppob"
import { useFetchData } from "@/hooks/useFetchData"
import Hero from "@/components/hero"
import Modal from "@/components/modal"
import Navigation from "@/components/navigation"

export default function IndexPage() {
  //hooks
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.session.token)
  const { loading, profile, balance, services, banners } = useFetchData()

  //state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "error" | null
  >(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    service_code: "",
  })

  const handleTransaction = (service: Service) => {
    setFormData({ service_code: service.service_code })
    setSelectedService(service)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (selectedService) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.data.status === 0) {
          setPaymentSuccess(true)
          setTransactionStatus("success")
          setAlertMessage(response.data.message)
        } else {
          setPaymentSuccess(false)
          setTransactionStatus("error")
          setAlertMessage(response.data.message)
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message
        setTransactionStatus("error")
        setAlertMessage(errorMessage)
      }
    }
  }
  useEffect(() => {
    if (paymentSuccess) {
      const fetchUpdatedBalance = async () => {
        try {
          const data = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/balance`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          dispatch(setBalance(data.data.data.balance))
        } catch (error) {
          console.error("Error fetching updated balance:", error)
        } finally {
          setPaymentSuccess(false)
        }
      }
      fetchUpdatedBalance()
    }
  }, [paymentSuccess, dispatch, token])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <HashLoader color="#f13b2f" loading />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-8">
        {profile && (
          <Hero
            username={`${profile.first_name} ${profile.last_name}`}
            balance={balance}
          />
        )}

        {/* services */}
        <div className=" grid w-full grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  xl:grid-cols-12 ">
          {Array.isArray(services) &&
            services.map((item) => (
              <div
                key={item.service_code}
                onClick={() => handleTransaction(item)}
                className="flex cursor-pointer flex-col items-center"
              >
                <Image
                  src={item.service_icon}
                  width={70}
                  height={70}
                  alt={item.service_name}
                />
                <p className="mt-2 text-center text-sm">{item.service_name}</p>
              </div>
            ))}
        </div>

        {/* banners */}
        <div className="flex flex-col gap-5">
          <div className=" font-semibold">Temukan promo menarik</div>
          <div className="flex justify-center gap-4">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
            >
              {Array.isArray(banners) &&
                banners.map((item) => (
                  <SwiperSlide key={item.banner_name}>
                    <img
                      src={item.banner_image}
                      alt={item.description}
                      className="w-full h-auto object-cover cursor-grab active:cursor-grabbing"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>

        <Modal
          showModal={showModal}
          alertMessage={alertMessage}
          selectedService={selectedService}
          transactionStatus={transactionStatus}
          setShowModal={setShowModal}
          setAlertMessage={setAlertMessage}
          handleSubmit={handleSubmit}
        />
      </main>
    </div>
  )
}
