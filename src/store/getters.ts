import { GetterTree } from 'vuex'
import { State, CardComplexity } from './state'
import stringSimilarity from 'string-similarity'

interface Getter {
  cardsWithComplexity: CardComplexity[]
  howItemNames: string[]
}

interface OrderedMatches<T = number> {
  [key: string]: T
}

const SIMILARITY_THRESHOLD = 0.2

export const getters: GetterTree<State, State> = {
  board: ({ board }) => board,
  cards: ({ cards }) => cards,
  cardsWithComplexity: ({ cards }) => cards.filter((card) => card.complexity),
  hows: ({ hows }) => hows,
  newHow: ({ newHow }) => newHow,
  howItems: ({ howItems }) => howItems,
  howItemNames: ({ howItems }) => howItems.map((howItem) => howItem.name),
  similarCards: (
    { newHow, hows, howItems },
    { cardsWithComplexity, howItemNames }: Getter
  ) => {
    if (!newHow || !howItemNames.length) {
      return []
    }
    const similarities = stringSimilarity.findBestMatch(newHow, howItemNames)
    const bestHowItemMatches: OrderedMatches = similarities.ratings
      .filter((rating) => rating.rating > SIMILARITY_THRESHOLD)
      .sort((a, b) => (a.rating > b.rating ? -1 : 1))
      .slice(0, 10)
      .reduce(
        (obj, similarity, index) => ({
          ...obj,
          [similarity.target]: index
        }),
        {}
      )

    const targetMatches = Object.keys(bestHowItemMatches)

    if (!targetMatches.length) {
      return []
    }

    const orderedHowIds: OrderedMatches = howItems
      .filter((item) => targetMatches.includes(item.name))
      .reduce(
        (obj, item) => ({
          ...obj,
          [item.idChecklist]: bestHowItemMatches[item.name]
        }),
        {}
      )

    const bestHowIds = Object.keys(orderedHowIds)

    if (!bestHowIds.length) {
      return []
    }

    const bestCardIdMatches: OrderedMatches = hows
      .filter((how) => bestHowIds.includes(how.id))
      .reduce(
        (obj, item) => ({
          ...obj,
          [item.idCard]: orderedHowIds[item.id]
        }),
        {}
      )

    const bestCardIds = Object.keys(bestCardIdMatches)

    if (!bestCardIds.length) {
      return []
    }

    const bestCards = cardsWithComplexity.filter((card) =>
      bestCardIds.includes(card.entity.id)
    )

    return bestCards.sort((a, b) =>
      bestCardIdMatches[a.entity.id] < bestCardIdMatches[b.entity.id] ? -1 : 1
    )
  }
}
