export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return `${formatted} zł`;
}
