import { getComplexityFromCardName } from '../card-utils'

describe('card util', () => {
  it('should return null if there is no parentheses or are empty', () => {
    expect(
      getComplexityFromCardName('As a user, I can click on the button')
    ).toEqual(null)
    expect(
      getComplexityFromCardName('() As a user, I can click on the button')
    ).toEqual(null)
  })
  it('should return the value in the parentheses', () => {
    expect(
      getComplexityFromCardName('(2) As a user, I can click on the button')
    ).toEqual(2)
    expect(
      getComplexityFromCardName('(0.5) As a user, I can click on the button')
    ).toEqual(0.5)
    expect(
      getComplexityFromCardName('(5) (3) As a user, I can click on the button')
    ).toEqual(5)
  })
})
