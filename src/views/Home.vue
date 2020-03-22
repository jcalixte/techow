<template>
  <div class="home">
    <button v-if="!isAuthenticated" @click="authenticate">auth</button>
    <select v-model="boardId">
      <option v-for="board in boards" :key="board.id" :value="board.id">
        {{ board.name }}
      </option>
    </select>
    <select v-model="listId">
      <option v-for="list in lists" :key="list.id" :value="list.id">
        {{ list.name }}
      </option>
    </select>
    <select v-model="card">
      <option v-for="c in cards" :key="c.id" :value="c">
        {{ c.name }}
      </option>
    </select>
    <div v-if="card">
      <button @click="createHow">Creer</button>
      <pre>{{ card }}</pre>
    </div>
    <div v-if="hows.length">
      <p v-for="how in hows" :key="how.id">
        {{ how.name }}
      </p>
    </div>
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
  private card: Card | null = null
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
    if (!this.card) {
      return
    }
    await trelloService.createHow(this.card.id)
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
