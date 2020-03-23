export const getComplexityFromCardName = (cardName: string): number | null => {
  const regExp = /\(([^)]+)\)/
  const matches = regExp.exec(cardName)
  if (!matches) {
    return null
  }
  const [_, complexity] = matches
  return parseFloat(complexity)
}
