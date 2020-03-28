<template>
  <div class="board-quality" v-if="board">
    <h1>{{ board.name }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { trelloService } from '@/services/trello.service'
import { Board } from '@/models/Board'
import { Card } from '@/models/Card'

@Component({
  components: {
    TrelloCard: () => import('@/components/TrelloCard.vue')
  }
})
export default class BoardQuality extends Vue {
  @Prop()
  boardId!: string
  @Action
  private initBoard!: (boardId: string) => Promise<void>
  board: Board | null = null
  cards: Card[] = []

  async mounted() {
    this.board = await trelloService.getBoard(this.boardId)
  }
}
</script>

<style scoped lang="scss">
.board-quality {
}
</style>
