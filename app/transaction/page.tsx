"use client"

//sources
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { RootState } from "@/redux/store"
import axios from "axios"
import { useSelector } from "react-redux"

import { useFetchData } from "@/hooks/useFetchData"
// components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Hero from "@/components/hero"
import Navigation from "@/components/navigation"

type Transaction = {
  invoice_number: string
  transaction_type: string
  description: string
  total_amount: number
  created_on: string
}

export default function TransactionPage() {
  //hooks
  const token = useSelector((state: RootState) => state.session.token)
  const { loading, profile, balance } = useFetchData()

  //state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [limit] = useState<number>(5)
  const [onLoad, setOnLoad] = useState<boolean>(false)
  const [isMore, setIsMore] = useState<boolean>(true)

  //fetch data
  const fetchTransactions = async () => {
    setOnLoad(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            offset,
            limit,
          },
        }
      )
      const newTransactions: Transaction[] = Object.values(
        response.data.data.records
      )

      if (newTransactions.length < limit) {
        setIsMore(false)
      }

      setTransactions((prev) => [...prev, ...newTransactions])
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setOnLoad(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchTransactions()
    }
  }, [offset, token])

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit)
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

        <div className="grid gap-4 md:gap-8 ">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Semua Transaksi</CardTitle>
                <CardDescription>
                  Transaksi terkini dari SIMS PPOB Anda.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nominal</TableHead>
                    <TableHead className="text-right">Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.invoice_number}>
                      <TableCell>
                        <div
                          className={`text-xl font-semibold ${
                            transaction.transaction_type === "TOPUP"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {transaction.transaction_type === "TOPUP"
                            ? `+ Rp.${transaction.total_amount}`
                            : `- Rp.${transaction.total_amount}`}
                        </div>
                        <div className="hidden text-xs text-muted-foreground md:inline">
                          {new Date(transaction.created_on).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          <span className="pl-2">
                            {new Date(
                              transaction.created_on
                            ).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}{" "}
                            WIB
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {onLoad && <p>Loading...</p>}

              <Button
                disabled={!isMore}
                variant="outline"
                onClick={handleShowMore}
                className="mt-4 w-full text-destructive hover:text-destructive"
              >
                Show More
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
