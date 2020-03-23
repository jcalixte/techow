import { ActionTree } from 'vuex'
import { State } from './state'
import { trelloService } from '@/services/trello.service'
import { SET_CARDS, SET_HOWS, SET_HOW_ITEMS } from './mutations'

export const actions: ActionTree<State, State> = {
  initBoard: async ({ commit }, boartdId: string) => {
    const [cards, checklists] = await Promise.all([
      trelloService.getBoardCards(boartdId),
      trelloService.getBoardChecklists(boartdId)
    ])
    commit(SET_CARDS, { cards })
    const hows = checklists.filter(
      (checklist) =>
        checklist.name.toLowerCase().includes('how') ||
        checklist.name.toLowerCase().includes('comment')
    )
    const howItems = hows.map((checklist) => checklist.checkItems).flat()
    commit(SET_HOWS, hows)
    commit(SET_HOW_ITEMS, howItems)
  }
}
