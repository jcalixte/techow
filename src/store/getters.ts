import { TechGetter } from '@/models/TechGetter'
import { getBestSimilarCards, getSimilarCards } from '@/utils/card-utils'
import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, State> = {
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
    if (
      !newHowItemContents.length ||
      !howItems.length ||
      !cardsWithComplexity.length
    ) {
      return []
    }

    const cards = cardsWithComplexity
      .filter((c) => !!c.entity)
      .map((c) => c.entity)

    return getBestSimilarCards(
      ...newHowItemContents.map((newHowItem) =>
        getSimilarCards({ newHowItem, hows, howItems, cards })
      )
    ).slice(0, 10)
  }
}
