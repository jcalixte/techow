import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, State> = {
  cards: ({ cards }) => cards,
  cardsWithComplexity: ({ cards }) => cards.filter((card) => card.complexity),
  hows: ({ hows }) => hows,
  howItems: ({ howItems }) => howItems
}
