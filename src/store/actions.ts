import { ActionTree } from 'vuex'
import { State, CardComplexity } from './state'
import { trelloService } from '@/services/trello.service'
import {
  SET_CARDS,
  SET_HOWS,
  SET_HOW_ITEMS,
  SET_NEW_HOW_ITEMS,
  SET_SIMILAR_CARDS
} from './mutations'
import { getBestSimilarCards, getSimilarCards } from '@/utils/card-utils'

export const actions: ActionTree<State, State> = {
  initBoard: async ({ commit }, boardId: string) => {
    const [cards, checklists] = await Promise.all([
      trelloService.getBoardCards(boardId),
      trelloService.getBoardChecklists(boardId)
    ])
    commit(SET_CARDS, { cards })
    const hows = checklists.filter((checklist) => {
      const checklistName = checklist.name.toLowerCase()
      return checklistName.includes('how') || checklistName.includes('comment')
    })
    hows.forEach((how) => how.checkItems.sort((a, b) => a.pos - b.pos))

    const howItems = hows.map((checklist) => checklist.checkItems).flat()
    commit(SET_HOWS, { hows })
    commit(SET_HOW_ITEMS, { howItems })
  },
  setNewHow({ commit }, newHow: string) {
    commit(SET_NEW_HOW_ITEMS, { newHow })
  },
  addNewHowItem({ state, commit }) {
    commit(SET_NEW_HOW_ITEMS, { newHowItems: [...state.newHowItems, ''] })
  },
  removeNewHowItem({ state, commit }, index: number) {
    const newHowItems = state.newHowItems.filter((_, i) => i !== index)
    commit(SET_NEW_HOW_ITEMS, { newHowItems: [...newHowItems] })
  },
  setNewHowItem(
    { state, commit, getters },
    { newHowItem, index }: { newHowItem: string; index: number }
  ) {
    const newHowItems = [...state.newHowItems]
    newHowItems[index] = newHowItem
    commit(SET_NEW_HOW_ITEMS, { newHowItems })

    const newHowItemContents = newHowItems.filter((item) => !!item)
    const cardsWithComplexity: CardComplexity[] = getters.cardsWithComplexity
    if (
      !newHowItemContents.length ||
      !state.howItems.length ||
      !cardsWithComplexity.length
    ) {
      commit(SET_SIMILAR_CARDS, { similarCards: [] })
      return
    }

    const cards = cardsWithComplexity
      .filter((c) => !!c.entity)
      .map((c) => c.entity)

    const props = {
      similarCards: getBestSimilarCards(
        ...newHowItemContents.map((newHowItem) =>
          getSimilarCards({
            newHowItem,
            hows: state.hows,
            howItems: state.howItems,
            cards
          })
        )
      ).slice(0, 10)
    }
    commit(SET_SIMILAR_CARDS, props)
  }
}
