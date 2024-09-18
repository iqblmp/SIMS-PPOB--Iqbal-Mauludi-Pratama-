"use client"

//sources
import { useEffect, useState } from "react"
import Link from "next/link"
import { setProfile } from "@/redux/informationSlice"
import { RootState } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Mail, Terminal, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
// components
import { HashLoader } from "react-spinners"
import { z } from "zod"

import { useFetchData } from "@/hooks/useFetchData"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Navigation from "@/components/navigation"

// schema
const formSchema = z.object({
  email: z
    .string({ required_error: "Email tidak boleh kosong" })
    .email({ message: "Email tidak valid" }),
  first_name: z
    .string({ required_error: "Nama depan tidak boleh kosong" })
    .min(2, { message: "Nama depan harus lebih dari 1 karakter" }),
  last_name: z
    .string({ required_error: "Nama belakang tidak boleh kosong" })
    .min(2, { message: "Nama belakang harus lebih dari 1 karakter" }),
})

export default function AkunPage() {
  //hooks
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.session.token)
  const { loading, profile } = useFetchData()
  //state
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<"success" | "destructive">(
    "success"
  )
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isEditProfile, setIsEditProfile] = useState<boolean>(false)

  //define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  //useeffect
  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      setIsProfileLoaded(true)
    }
  }, [profile, form, isEditProfile])

  //submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/update`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.status == 0) {
        setIsEditProfile(false)
        setAlertMessage(response.data.message)
        setAlertType("success")
        setTimeout(() => setAlertMessage(null), 3000)
      } else {
        setAlertMessage(response.data.message)
        setAlertType("destructive")
        setTimeout(() => setAlertMessage(null), 3000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      setAlertMessage(errorMessage)
      setAlertType("destructive")
    }
  }

  //   handle file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const allowedTypes = ["image/jpeg", "image/png"]

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setAlertMessage("")
        setAlertType("destructive")
        setTimeout(() => setAlertMessage(null), 3000)
        return
      }

      if (file.size > 100 * 1024) {
        setAlertMessage("File size exceeds 100 KB")
        setAlertType("destructive")
        setTimeout(() => setAlertMessage(null), 3000)
        return
      }

      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  //handle file upload
  const handleUpload = async () => {
    if (!selectedImage) return

    const formData = new FormData()
    formData.append("file", selectedImage)

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const profile_image = response.data.data.profile_image
      const { status, message } = response.data

      setAlertMessage(message)
      setAlertType(status === 0 ? "success" : "destructive")

      if (status === 0) {
        setSelectedImage(null)
        setImagePreview(profile_image)
        dispatch(
          setProfile({
            ...profile,
            profile_image: profile_image,
          })
        )
      }

      setTimeout(() => setAlertMessage(null), 3000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      setAlertMessage(errorMessage || "Upload failed")
      setAlertType("destructive")
      setTimeout(() => setAlertMessage(null), 3000)
    }
  }

  if (loading || !isProfileLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <HashLoader color="#f13b2f" loading />
      </div>
    )
  }
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="fileInput">
            {profile && (
              <img
                src={
                  imagePreview ||
                  (profile?.profile_image !==
                  "https://minio.nutech-integrasi.com/take-home-test/null"
                    ? profile.profile_image
                    : "Profile Photo.png")
                }
                width={120}
                height={120}
                className="cursor-pointer pb-4"
                alt="profile"
              />
            )}
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="text-3xl font-bold">
            {profile?.first_name} {profile?.last_name}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid gap-4  w-[50%]">
            {alertMessage && (
              <Alert variant={alertType}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                  {alertType === "success" ? "Success!" : "Error!"}
                </AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            readOnly={!isEditProfile}
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
                      <FormLabel>Nama Depan</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2  text-gray-500" />
                          <Input
                            readOnly={!isEditProfile}
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
                      <FormLabel>Nama Belakang</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2 text-gray-500" />
                          <Input
                            readOnly={!isEditProfile}
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
                {selectedImage ? (
                  <Button
                    onClick={handleUpload}
                    type="button"
                    variant="destructive"
                    className="w-full "
                  >
                    Simpan
                  </Button>
                ) : (
                  <div className="flex flex-col gap-y-4">
                    <Button
                      onClick={() => setIsEditProfile(!isEditProfile)}
                      type="button"
                      variant="border"
                      className="w-full  "
                    >
                      {isEditProfile ? "Batalkan" : "Edit Profil"}
                    </Button>
                    {isEditProfile ? (
                      <Button
                        type="submit"
                        variant="destructive"
                        className="w-full "
                      >
                        Simpan
                      </Button>
                    ) : (
                      <Link href="/logout">
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full "
                        >
                          Logout
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  )
}
