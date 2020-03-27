import { ActionTree, Commit } from 'vuex'
import { State, CardComplexity } from './state'
import { trelloService } from '@/services/trello.service'
import {
  SET_CARDS,
  SET_HOWS,
  SET_HOW_ITEMS,
  SET_NEW_HOW_ITEMS,
  SET_SIMILAR_CARDS
} from './mutations'
import { getBestSimilarCards, getSimilarCards } from '@/workers/card.worker'
import { ChecklistItem } from '@/models/ChecklistItem'
import { Checklist } from '@/models/Checklist'

const computeSimilarCards = async (
  commit: Commit,
  hows: Checklist[],
  howItems: ChecklistItem[],
  newHowItems: string[],
  cardsWithComplexity: CardComplexity[]
) => {
  const newHowItemContents = newHowItems.filter((item) => !!item)

  if (
    !newHowItemContents.length ||
    !howItems.length ||
    !cardsWithComplexity.length
  ) {
    commit(SET_SIMILAR_CARDS, { similarCards: [] })
    return
  }

  const cards = cardsWithComplexity
    .filter((c) => !!c.entity)
    .map((c) => c.entity)

  const [...collections] = await Promise.all(
    newHowItemContents.map((newHowItem) =>
      getSimilarCards({
        newHowItem,
        hows,
        howItems,
        cards
      })
    )
  )

  const props = {
    similarCards: ((await getBestSimilarCards(...collections)) || []).slice(
      0,
      10
    )
  }
  commit(SET_SIMILAR_CARDS, props)
}

export const actions: ActionTree<State, State> = {
  initBoard: async ({ commit, getters, state }, boardId: string) => {
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
    await computeSimilarCards(
      commit,
      state.hows,
      state.howItems,
      state.newHowItems,
      getters.cardsWithComplexity
    )
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
  async setNewHowItem(
    { state, commit, getters },
    { newHowItem, index }: { newHowItem: string; index: number }
  ) {
    const newHowItems = [...state.newHowItems]
    newHowItems[index] = newHowItem
    commit(SET_NEW_HOW_ITEMS, { newHowItems })

    await computeSimilarCards(
      commit,
      state.hows,
      state.howItems,
      state.newHowItems,
      getters.cardsWithComplexity
    )
  }
}
