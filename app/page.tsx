"use client"

//sources
import { useEffect, useState } from "react"
import Image from "next/image"
import { setBalance } from "@/redux/informationSlice"
import { RootState } from "@/redux/store"
import axios from "axios"
import { Check, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { HashLoader } from "react-spinners"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import { useFetchData } from "@/hooks/useFetchData"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Hero from "@/components/hero"
import Navigation from "@/components/navigation"

type Service = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

export default function IndexPage() {
  //hooks
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.session.token)
  const { loading, profile, balance, services, banners } = useFetchData()

  //state
  const [onTransaction, setOnTransaction] = useState<boolean>(false)
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
  }, [paymentSuccess, dispatch])

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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* profile */}
        {profile && (
          <Hero
            username={`${profile.first_name} ${profile.last_name}`}
            balance={balance}
          />
        )}

        {/* modal */}
        <AlertDialog open={showModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Pembayaran {selectedService?.service_name} sebesar
              </AlertDialogTitle>

              <div>
                <div className="fixed right-5 top-5 items-center justify-end -z-10 ">
                  <img
                    className="w-9 md:w-12"
                    src={selectedService?.service_icon}
                    alt="icon"
                  />
                </div>
                <p className="font-semibold text-xl pb-2">
                  Rp.{selectedService?.service_tariff}
                </p>

                <p className="text-sm font-semibold">
                  {alertMessage ? (
                    <p
                      className={
                        transactionStatus === "success"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {alertMessage}
                    </p>
                  ) : (
                    `Klik "Lanjutkan" untuk membayar`
                  )}
                </p>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowModal(false)
                  setAlertMessage(null)
                }}
              >
                {!alertMessage ? "Batalkan" : "Kembali ke Beranda"}
              </AlertDialogCancel>
              {!alertMessage && (
                <AlertDialogAction onClick={handleSubmit}>
                  Lanjutkan
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* services */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full justify-center">
          {Array.isArray(services) &&
            services.map((item) => (
              <div
                key={item.service_code}
                onClick={() => handleTransaction(item)}
                className="cursor-pointer flex flex-col items-center"
              >
                <Image
                  src={item.service_icon}
                  width={70}
                  height={70}
                  alt={item.service_name}
                />
                <p className="text-center text-sm mt-2">{item.service_name}</p>
              </div>
            ))}
        </div>

        <div className="font-semibold pt-1">Temukan promo menarik</div>

        {/* banners */}
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
      </main>
    </div>
  )
}
