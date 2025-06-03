export function formatRupiah(
  amount: number | string | undefined
): string | undefined {
  return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
