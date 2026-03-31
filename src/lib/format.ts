export function formatSum(value: number) {
  return `${new Intl.NumberFormat("uz-UZ")
    .format(value)
    .replace(/\u00A0/g, " ")} so'm`;
}

export function formatMonthly(value: number) {
  return `${formatSum(value)}/oy`;
}
