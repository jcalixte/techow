import { Card } from '@/models/Card'
import { CardScore } from '@/models/CardScore'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'
import { getComplexityFromCardName } from '@/utils/card-utils'
import Vue from 'vue'
import { MutationTree } from 'vuex'
import { State } from './state'

export const SET_CARDS = 'SET_CARDS'
export const SET_CHECKLISTS = 'SET_CHECKLISTS'
export const SET_HOWS = 'SET_HOWS'
export const SET_HOW_ITEMS = 'SET_HOW_ITEMS'
export const SET_NEW_HOW_ITEMS = 'SET_NEW_HOW_ITEMS'
export const SET_SIMILAR_CARDS = 'SET_SIMILAR_CARDS'

export const mutations: MutationTree<State> = {
  [SET_CARDS](state, { cards }: { cards: Card[] }) {
    state.cards = (cards || []).map((card) => ({
      entity: card,
      complexity: getComplexityFromCardName(card.name)
    }))
  },
  [SET_CHECKLISTS](state, { checklists }: { checklists: Checklist[] }) {
    state.checklists = checklists
  },
  [SET_HOWS](state, { hows }: { hows: Checklist[] }) {
    state.hows = hows
  },
  [SET_HOW_ITEMS](state, { howItems }: { howItems: ChecklistItem[] }) {
    state.howItems = howItems
  },
  [SET_NEW_HOW_ITEMS](state, { newHowItems }: { newHowItems: string[] }) {
    state.newHowItems = newHowItems
  },
  [SET_SIMILAR_CARDS](state, { similarCards }: { similarCards: CardScore[] }) {
    if (similarCards.length) {
      Vue.notify({
        group: 'notification',
        title: 'Tickets similaires retrouvés',
        type: 'success'
      })
    }
    state.similarCards = similarCards
  }
}
