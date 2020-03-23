import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, State> = {
  cards: ({ cards }) => cards,
  hows: ({ hows }) => hows,
  howItems: ({ howItems }) => howItems
}
