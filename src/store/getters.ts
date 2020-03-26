import { GetterTree } from 'vuex'
import { State } from './state'
import { TechGetter } from '@/models/TechGetter'
import { getSimilarCards, getBestSimilarCards } from '@/utils/card-utils'

export const getters: GetterTree<State, State> = {
  board: ({ board }) => board,
  cards: ({ cards }) => cards,
  cardsWithComplexity: ({ cards }) => cards.filter((card) => card.complexity),
  hows: ({ hows }) => hows,
  newHowItems: ({ newHowItems }) => newHowItems,
  howItems: ({ howItems }) => howItems,
  similarCards: (
    { newHowItems, hows, howItems },
    { cardsWithComplexity }: TechGetter
  ) => {
    const newHowItemContents = newHowItems.filter((item) => !!item)
    if (!newHowItemContents.length || !howItems.length) {
      return []
    }

    const cards = cardsWithComplexity.map((c) => c.entity)

    return getBestSimilarCards(
      ...newHowItemContents.map((newHowItem) =>
        getSimilarCards({ newHowItem, hows, howItems, cards })
      )
    ).slice(0, 10)
  }
}
