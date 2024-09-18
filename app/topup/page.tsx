"use client"

//sources
import { useEffect, useState } from "react"
import { setBalance } from "@/redux/informationSlice"
import { RootState } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowUpRight, CreditCard, Terminal } from "lucide-react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
// components
import { HashLoader } from "react-spinners"
import { z } from "zod"

import { useFetchData } from "@/hooks/useFetchData"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Hero from "@/components/hero"
import Navigation from "@/components/navigation"

const formSchema = z.object({
  top_up_amount: z.coerce
    .number({
      required_error: "Nominal tidak boleh kosong",
      invalid_type_error: "Nominal harus di isi dengan angka",
    })
    .gte(10000, { message: "Minimum nominal Top Up adalah Rp10.000" })
    .lte(1000000, { message: "Maksimum nominal Top Up adalah Rp1.000.000" }),
})

const nominal = [
  { name: "Rp10.000", value: 10000 },
  { name: "Rp20.000", value: 20000 },
  { name: "Rp50.000", value: 50000 },
  { name: "Rp100.000", value: 100000 },
  { name: "Rp250.000", value: 250000 },
  { name: "Rp500.000", value: 500000 },
]

export default function TopUpPage() {
  //hooks

  const { loading, profile, balance } = useFetchData()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.session.token)
  //state
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"success" | "destructive">(
    "success"
  )
  const [topUpSuccess, setTopUpSuccess] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/topup`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.data.status === 0) {
        setAlertMessage(response.data.message)
        setAlertType("success")
        setTopUpSuccess(true)
        setTimeout(() => setAlertMessage(null), 3000)
      } else {
        setAlertMessage(response.data.message)
        setAlertType("destructive")
        setTopUpSuccess(false)
        setTimeout(() => setAlertMessage(null), 3000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      setAlertMessage(errorMessage)
      setAlertType("destructive")
      setTopUpSuccess(false)
    }
  }

  useEffect(() => {
    if (topUpSuccess) {
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
          setTopUpSuccess(false)
          form.reset({ top_up_amount: 0 })
        }
      }
      fetchUpdatedBalance()
    }
  }, [topUpSuccess, dispatch])

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
        {alertMessage && (
          <Alert variant={alertType}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>
              {alertType === "success" ? "Success!" : "Error!"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        {profile && (
          <Hero
            username={`${profile.first_name} ${profile.last_name}`}
            balance={balance}
          />
        )}
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 py-0">
            <CardTitle className="text-base font-medium ">
              Silahkan masukan
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">Nominal Top Up</div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2 border-none">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="top_up_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            placeholder="masukan nominal Top Up"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={!form.watch("top_up_amount")}
                  className="ml-auto gap-1 w-full disabled:cursor-not-allowed"
                >
                  Top Up
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </Card>
          <Card className="grid grid-cols-3 gap-x-3 gap-y-5 border-none shadow-none">
            {nominal.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                type="submit"
                className="ml-auto gap-1 w-full"
                onClick={() => form.setValue("top_up_amount", item.value)}
              >
                {item.name}
              </Button>
            ))}
          </Card>
        </div>
      </main>
    </div>
  )
}
