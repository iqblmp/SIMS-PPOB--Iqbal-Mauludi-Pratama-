"use client"

//sources
import { useState } from "react"
import Image from "next/image"
import { RootState } from "@/redux/store"
import axios from "axios"
import { Check, X } from "lucide-react"
//hooks
import { useSelector } from "react-redux"

import { useFetchData } from "@/hooks/useFetchData"
// components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
  const token = useSelector((state: RootState) => state.session.token)
  const { loading, profile, balance, services, banners } = useFetchData()

  //state
  const [onTransaction, setOnTransaction] = useState<boolean>(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "error" | null
  >(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    service_code: "",
  })

  const handleTransaction = (service: Service) => {
    console.log(service)
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
          setTransactionStatus("success")
          setAlertMessage(response.data.message)
        } else {
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
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {profile && (
          <Hero
            username={`${profile.first_name} ${profile.last_name}`}
            balance={balance}
          />
        )}
        <AlertDialog open={showModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Pembayaran {selectedService?.service_name} sebesar
              </AlertDialogTitle>

              <div className="modal-content">
                <div className="fixed right-5 top-5   items-center justify-end">
                  <img
                    src={selectedService?.service_icon}
                    width={50}
                    height={50}
                    alt="icon"
                  />
                </div>
                <p></p>
                <p className="font-semibold text-xl pb-2">
                  Rp.{selectedService?.service_tariff}
                </p>

                <p className="text-sm">
                  {alertMessage ? (
                    <div
                      className={`flex gap-x-2 items-center ${
                        transactionStatus === "success"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      } `}
                    >
                      {alertMessage}
                      {transactionStatus === "success" ? <Check /> : <X />}
                    </div>
                  ) : (
                    "Klik Lanjutkan untuk membayar"
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
        <div className="flex justify-center gap-4">
          {Array.isArray(banners) &&
            banners.map((item) => (
              <div
                key={item.banner_name}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <Image
                  src={item.banner_image}
                  width={271}
                  height={121}
                  alt={item.description}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
        </div>

        {/* <div className="flex gap-x-5">
          {Array.isArray(banners) &&
            banners.map((item) => (
              <div key={item.banner_name}>
                <Image
                  src={item.banner_image}
                  width={271}
                  height={121}
                  alt={item.description}
                />
              </div>
            ))}
        </div> */}
      </main>
    </div>
  )
}
