export const getAdDeclension = (count: number): string => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'объявлений'
  }

  switch (lastDigit) {
    case 1:
      return 'объявление'
    case 2:
    case 3:
    case 4:
      return 'объявления'
    default:
      return 'объявлений'
  }
}
