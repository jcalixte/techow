import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, State> = {
  cards: ({ cards }) => cards,
  cardsWithComplexity: ({ cards }) => cards.filter((card) => card.complexity),
  checklists: ({ checklists }) => checklists,
  hows: ({ hows }) => hows,
  newHowItems: ({ newHowItems }) => newHowItems,
  howItems: ({ howItems }) => howItems,
  similarCards: ({ similarCards }) => similarCards
}
