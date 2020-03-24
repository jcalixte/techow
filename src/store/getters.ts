import { GetterTree } from 'vuex'
import { State, CardComplexity } from './state'
import stringSimilarity from 'string-similarity'

interface Getter {
  cardsWithComplexity: CardComplexity[]
  howItemNames: string[]
}

const SIMILARITY_THRESHOLD = 0.2

export const getters: GetterTree<State, State> = {
  cards: ({ cards }) => cards,
  cardsWithComplexity: ({ cards }) => cards.filter((card) => card.complexity),
  hows: ({ hows }) => hows,
  newHow: ({ newHow }) => newHow,
  howItems: ({ howItems }) => howItems,
  howItemNames: ({ howItems }) => howItems.map((howItem) => howItem.name),
  setNewHow: ({ newHow }) => newHow,
  similarCards: (
    { newHow, hows, howItems },
    { cardsWithComplexity, howItemNames }: Getter
  ) => {
    if (!newHow) {
      return []
    }
    const similarities = stringSimilarity.findBestMatch(newHow, howItemNames)
    const bestHowItemMatches = similarities.ratings
      .filter((rating) => rating.rating > SIMILARITY_THRESHOLD)
      .map((rating) => rating.target)

    console.log({ similarities, bestHowItemMatches })

    if (!bestHowItemMatches.length) {
      return []
    }

    const bestHowIds = howItems
      .filter((how) => bestHowItemMatches.includes(how.name))
      .map((how) => how.idChecklist)

    const bestHowCardIds = hows
      .filter((how) => bestHowIds.includes(how.id))
      .map((how) => how.idCard)

    const bestCards = cardsWithComplexity.filter((card) =>
      bestHowCardIds.includes(card.entity.id)
    )

    console.log({ bestHowCardIds, bestCards })
    return bestCards
  }
}
