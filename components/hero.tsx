"use client"

import React, { useState } from "react"
import Image from "next/image"
import { DollarSign, Eye, EyeOff } from "lucide-react"

import { useFetchData } from "@/hooks/useFetchData"
//components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type HeroProps = {
  username: string | null
  balance: number | null
}

const Hero: React.FC<HeroProps> = ({ username, balance }) => {
  const { profile } = useFetchData()
  //state
  const [showBalance, setShowBalance] = useState<boolean>(true)
  //function
  const toggleBalance = () => {
    setShowBalance((prev) => !prev)
  }
  function formatRupiah(amount: number | null): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  return (
    <div className="grid gap-4  md:gap-8 lg:grid-cols-2">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 py-0">
          <CardTitle className="text-base font-medium ">
            {profile && (
              <img
                src={
                  profile.profile_image !==
                  "https://minio.nutech-integrasi.com/take-home-test/null"
                    ? profile.profile_image
                    : "Profile Photo.png"
                }
                width={70}
                height={70}
                className="pb-4"
                alt="profile"
              />
            )}
            Selamat Datang,
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="text-3xl font-bold">{username}</div>
        </CardContent>
      </Card>
      <Card className="bg-balance bg-cover text-white rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo anda</CardTitle>
          <DollarSign className="h-4 w-4 " />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rp {showBalance ? formatRupiah(balance) : "••••••••"}
          </div>
          <div className="flex items-center gap-2 pt-4">
            <p className="text-xs">
              {showBalance ? "Tutup saldo" : "Lihat saldo"}
            </p>
            <button onClick={toggleBalance}>
              {showBalance ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Hero
