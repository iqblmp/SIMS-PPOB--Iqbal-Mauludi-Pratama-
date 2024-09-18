"use client"

// sources
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Eye, EyeOff, Lock, Mail, Terminal, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// components
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

// schema
const formSchema = z
  .object({
    email: z
      .string({ required_error: "Email tidak boleh kosong" })
      .email({ message: "Email tidak valid" }),
    first_name: z
      .string({ required_error: "Nama depan tidak boleh kosong" })
      .min(2, { message: "Nama depan harus lebih dari 1 karakter" }),
    last_name: z
      .string({ required_error: "Nama belakang tidak boleh kosong" })
      .min(2, { message: "Nama belakang harus lebih dari 1 karakter" }),
    password: z
      .string({ required_error: "Password tidak boleh kosong" })
      .min(8, { message: "Password minimal harus 8 karakter" }),
    confirm_password: z
      .string({ required_error: "Konfirmasi password tidak boleh kosong" })
      .min(8, { message: "Konfirmasi password minimal harus 8 karakter" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirm_password"],
  })

export default function RegistrationdPage() {
  //hooks
  const router = useRouter()

  //state
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  //define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  //submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirm_password, ...formData } = values
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/registration`,
        formData
      )

      if (response.data.status == 0) {
        setAlertMessage(response.data.message)
        setAlertType("success")
        setTimeout(() => router.push("/login"), 3000)
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
              Lengkapi data untuk membuat akun
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

                {/* First Name Field */}
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            placeholder="masukan nama depan anda"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name Field */}
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2 text-gray-500" />
                          <Input
                            placeholder="masukan nama belakang anda"
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

                {/* Konfirmasi Password Field */}
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="konfirmasi password anda"
                            {...field}
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-2"
                          >
                            {showConfirmPassword ? (
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
                  Registrasi
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-destructive">
              login disini
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
