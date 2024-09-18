"use client"

// sources
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setToken } from "@/redux/sessionSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { setCookie } from "cookies-next"
import { Eye, EyeOff, Lock, Mail, Terminal, User } from "lucide-react"
import { useForm } from "react-hook-form"
//store
import { useDispatch } from "react-redux"
import { z } from "zod"

//components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

//schema
const formSchema = z.object({
  email: z
    .string({ required_error: "Email tidak boleh kosong" })
    .email({ message: "Email tidak valid" }),
  password: z
    .string({ required_error: "Password tidak boleh kosong" })
    .min(8, { message: "Password minimal harus 8 karakter" }),
})

export default function LoginPage() {
  //hooks
  const dispatch = useDispatch()
  const router = useRouter()

  //state
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [showPassword, setShowPassword] = useState(false)

  //define form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  //submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        values
      )
      if (response.data.status == 0) {
        //set token
        const token = response.data.data.token
        dispatch(setToken(token))
        setCookie("token", token, {
          maxAge: 60 * 60 * 12, // 12 jam
          path: "/", // Pastikan cookie tersedia di seluruh situs
        })

        //set message
        setAlertMessage(response.data.message)
        setAlertType("success")

        //redirect
        setTimeout(() => router.push("/"), 3000)
      } else {
        setAlertMessage(response.data.message)
        setAlertType("error")
        setTimeout(() => setAlertMessage(null), 3000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      setAlertMessage(errorMessage)
      setAlertType("error")
    }
  }
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              Masuk atau buat akun untuk memulai
            </h1>
          </div>
          {alertMessage && (
            <Alert className={`alert-${alertType}`}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>
                {alertType === "success" ? "Success!" : "Error!"}
              </AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            placeholder="masukan email anda"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="masukan password anda"
                            {...field}
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2"
                          >
                            {showPassword ? (
                              <EyeOff className="text-gray-500" />
                            ) : (
                              <Eye className="text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-destructive hover:bg-destructive"
                >
                  Masuk
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            belum punya akun?{" "}
            <Link
              href="/registration"
              className="font-semibold text-destructive"
            >
              registrasi disini
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/Illustrasi Login.png"
          alt="Image"
          width="752"
          height="1024"
          className="h-auto w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
