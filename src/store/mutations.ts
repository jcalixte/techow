import { MutationTree } from 'vuex'
import { getComplexityFromCardName } from '@/utils/card-utils'
import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'
import { Board } from '@/models/Board'
import { State } from './state'

export const SET_BOARD = 'SET_BOARD'
export const SET_CARDS = 'SET_CARDS'
export const SET_HOWS = 'SET_HOWS'
export const SET_HOW_ITEMS = 'SET_HOW_ITEMS'
export const SET_NEW_HOW = 'SET_NEW_HOW'

export const mutations: MutationTree<State> = {
  [SET_BOARD](state, { board }: { board: Board }) {
    state.board = board
  },
  [SET_CARDS](state, { cards }: { cards: Card[] }) {
    state.cards = cards.map((card) => ({
      entity: card,
      complexity: getComplexityFromCardName(card.name)
    }))
  },
  [SET_HOWS](state, { hows }: { hows: Checklist[] }) {
    state.hows = hows
  },
  [SET_HOW_ITEMS](state, { howItems }: { howItems: ChecklistItem[] }) {
    state.howItems = howItems
  },
  [SET_NEW_HOW](state, { newHow }: { newHow: string }) {
    state.newHow = newHow
  }
}
