<template>
  <div class="board">
    <h1 v-if="board">
      {{ board.name }}

      <router-link
        tag="md-button"
        :to="{ name: 'BoardQuality', params: { boardId: board.id } }"
      >
        qualité
      </router-link>
    </h1>
    <div>
      <div class="md-layout-item">
        <md-field v-if="boardId">
          <label for="listId">Liste</label>
          <md-select v-model="listId" name="listId" id="listId">
            <md-option v-for="list in lists" :key="list.id" :value="list.id">
              {{ list.name }}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field v-if="listId">
          <label for="cardId">Ticket</label>
          <md-select v-model="cardId" name="cardId" id="cardId">
            <md-option v-for="c in boardCards" :key="c.id" :value="c.id">
              {{ c.name }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div>
    <div>
      <div class="md-layout-item">
        <h2>[Comment]</h2>
        <HowItem v-for="(item, i) in newHowItems" :key="i" :index="i" />
        <md-button class="md-icon-button md-raised" @click="addNewHowItem">
          <md-icon>add</md-icon>
        </md-button>
      </div>
      <div class="md-layout-item" v-if="card">
        <md-button class="md-raised" @click="createHow">
          Créer le comment technique
        </md-button>
        <hr />
      </div>
      <div class="md-layout-item" v-if="similarCards.length">
        <h3>Tickets similaires</h3>
        <div class="card-container">
          <TrelloCard
            v-for="card in similarCards"
            :key="card.entity.id"
            :card="card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { debounce } from 'lodash-es'

import { trelloService } from '@/services/trello.service'
import { Board } from '@/models/Board'
import { List } from '@/models/List'
import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { CardScore } from '../models/CardScore'

@Component({
  components: {
    TrelloCard: () => import('@/components/TrelloCard.vue'),
    HowItem: () => import('@/components/HowItem.vue')
  }
})
export default class BoardView extends Vue {
  @Prop({ type: String, required: true })
  private boardId!: string
  private listId: string | null = null
  private lists: List[] = []
  private boardCards: Card[] = []
  private cardId: string | null = null
  private checklists: Checklist[] = []
  private updateNewHow = debounce(
    (home: BoardView, newHow: string) => home.setNewHow(newHow),
    250
  )
  private board: Board | null = null
  @Getter
  private newHowItems!: string[]
  @Getter
  private similarCards!: CardScore[]
  @Getter
  private hows!: Checklist[]
  @Action
  private initBoard!: (boardId: string) => Promise<void>
  @Action
  private addNewHowItem!: () => void
  @Action
  private setNewHow!: (newHow: string) => Promise<void>

  private async mounted() {
    this.board = await trelloService.getBoard(this.boardId)
  }

  private async getLists() {
    if (!this.boardId) {
      return
    }
    this.lists = await trelloService.getLists(this.boardId)
  }

  private async getCards() {
    if (!this.listId) {
      return
    }
    this.boardCards = await trelloService.getCards(this.listId)
  }

  private async getChecklists() {
    if (!this.boardId) {
      return
    }
    this.checklists = await trelloService.getBoardChecklists(this.boardId)
  }

  private async createHow() {
    if (!this.cardId) {
      return
    }
    await trelloService.createHow(this.cardId, this.newHowItems)
  }

  private getHowByCardId(cardId: string) {
    return this.hows.filter((how) => how.idCard === cardId)
  }

  private get card(): Card | null {
    return this.boardCards.find((card) => card.id === this.cardId) || null
  }

  @Watch('boardId', { immediate: true })
  private onBoardIdChange() {
    this.getLists()
    this.getChecklists()
    if (this.boardId) {
      this.initBoard(this.boardId)
    }
  }

  @Watch('listId')
  private onListIdChange() {
    this.getCards()
  }
}
</script>

<style scoped lang="scss">
.board {
  .card-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
  }
}
</style>
