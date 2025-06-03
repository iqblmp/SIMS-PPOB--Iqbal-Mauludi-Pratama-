import React from "react"
import { formatRupiah } from "@/utils/formatter"

import { Service } from "@/types/ppob"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
  showModal: boolean
  alertMessage: string | null
  transactionStatus: "pending" | "success" | "error" | null
  selectedService: Service | null
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>
  handleSubmit: () => void
}

const Modal = ({
  showModal,
  alertMessage,
  selectedService,
  transactionStatus,
  setShowModal,
  setAlertMessage,
  handleSubmit,
}: Props) => {
  return (
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
              Rp {formatRupiah(selectedService?.service_tariff)}
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
  )
}

export default Modal
