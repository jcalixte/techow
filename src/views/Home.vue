<template>
  <div class="home">
    <button
      class="mdc-button foo-button"
      v-if="!isAuthenticated"
      @click="authenticate"
    >
      <div class="mdc-button__ripple"></div>
      <span class="mdc-button__label">se connecter</span>
    </button>
    <div>
      <div class="md-layout-item">
        <md-field>
          <label for="boardId">Tableau</label>
          <md-select v-model="boardId" name="boardId" id="boardId">
            <md-option
              v-for="board in boards"
              :key="board.id"
              :value="board.id"
            >
              {{ board.name }}
            </md-option>
          </md-select>
        </md-field>
      </div>
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
        <md-field class="field">
          <label>[HOW]</label>
          <md-input v-model="localeNewHow" />
        </md-field>
      </div>
      <div class="md-layout-item card-container" v-if="similarCards.length">
        <h3>Tickets similaires</h3>
        <TrelloCard
          v-for="card in similarCards"
          :key="card.entity.id"
          :card="card.entity"
        />
      </div>
    </div>
    <div v-if="card">
      <button class="mdc-button foo-button" @click="createHow">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Créer le comment technique</span>
      </button>
      <h3>{{ card.name }}</h3>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from 'vuex-class'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { debounce } from 'lodash-es'

import { trelloService } from '@/services/trello.service'
import { Board } from '@/models/Board'
import { List } from '@/models/List'
import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { CardComplexity } from '@/store/state'

@Component({
  components: {
    TrelloCard: () => import('@/components/TrelloCard.vue')
  }
})
export default class Home extends Vue {
  private boardId: string | null = null
  private boards: Board[] = []
  private listId: string | null = null
  private lists: List[] = []
  private boardCards: Card[] = []
  private cardId: string | null = null
  private checklists: Checklist[] = []
  private updateNewHow = debounce(
    (home: Home, newHow: string) => home.setNewHow(newHow),
    250
  )
  private isAuthenticated = trelloService.isAuthenticated
  @Getter
  private board!: Board | null
  @Getter
  private newHow!: string
  @Getter
  private similarCards!: CardComplexity[]
  @Getter
  private hows!: Checklist[]
  @Action
  private initBoard!: (boardId: string) => Promise<void>
  @Action
  private setNewHow!: (newHow: string) => Promise<void>

  private mounted() {
    this.getBoards()
    if (this.board) {
      this.boardId = this.board.id
    }
  }

  private authenticate() {
    trelloService.askPermission()
  }

  private async getBoards() {
    this.boards = await trelloService.getBoards()
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
    await trelloService.createHow(this.cardId)
  }

  private getHowByCardId(cardId: string) {
    return this.hows.filter((how) => how.idCard === cardId)
  }

  private get card(): Card | null {
    return this.boardCards.find((card) => card.id === this.cardId) || null
  }

  private get localeNewHow() {
    return this.newHow
  }

  private set localeNewHow(newHow: string) {
    this.updateNewHow(this, newHow)
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

<style lang="scss" scoped>
.home {
  padding: 15px;

  .field {
    max-width: 800px;
  }
}

.card-name {
  word-break: break-all;
  text-overflow: clip;
}

.md-card {
  margin: 10px 0;
}
</style>
