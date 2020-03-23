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
    <div class="md-layout md-gutter">
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
            <md-option v-for="c in cards" :key="c.id" :value="c.id">
              {{ c.name }}
            </md-option>
          </md-select>
        </md-field>
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
    <md-list v-if="hows.length">
      <md-list-item v-for="how in hows" :key="how.id">
        <md-icon>code</md-icon>
        <span class="md-list-item-text">{{ how.name }}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { trelloService } from '../services/trello.service'
import { Board } from '../models/Board'
import { List } from '../models/List'
import { Card } from '../models/Card'
import { Checklist } from '../models/Checklist'

@Component
export default class Home extends Vue {
  private boardId: string | null = null
  private boards: Board[] = []
  private listId: string | null = null
  private lists: List[] = []
  private cardId: string | null = null
  private cards: Card[] = []
  private checklists: Checklist[] = []
  private isAuthenticated = trelloService.isAuthenticated

  private mounted() {
    this.getBoards()
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
    this.cards = await trelloService.getCards(this.listId)
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

  private get card(): Card | null {
    return this.cards.find((card) => card.id === this.cardId) || null
  }

  private get hows() {
    return this.checklists
      .filter(
        (checklist) =>
          checklist.name.toLowerCase().includes('how') ||
          checklist.name.toLowerCase().includes('comment')
      )
      .map((checklist) => checklist.checkItems)
      .flat()
  }

  @Watch('boardId')
  private onBoardIdChange() {
    this.getLists()
    this.getChecklists()
  }

  @Watch('listId')
  private onListIdChange() {
    this.getCards()
  }
}
</script>
