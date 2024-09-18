import { PayloadAction, createSlice } from "@reduxjs/toolkit"

//type
type Profile = {
  email?: string
  first_name?: string
  last_name?: string
  profile_image?: string
}

type Service = {
  service_code: string
  service_name: string
  service_icon: string
  service_tariff: number
}

type Banner = {
  banner_name: string
  banner_image: string
  description: string
}

type InformationState = {
  profile: Profile | null
  balance: number | null
  services: Service[]
  banners: Banner[]
}

const initialState: InformationState = {
  profile: null,
  balance: null,
  services: [],
  banners: [],
}

const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload
    },
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.banners = action.payload
    },
  },
})

export const { setProfile, setBalance, setServices, setBanners } =
  informationSlice.actions
export default informationSlice.reducer
