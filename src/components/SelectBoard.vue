<template>
  <div class="select-board">
    <md-card
      class="md-primary board-card"
      v-for="board in boards"
      :key="board.id"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ board.name }}</div>
        </md-card-header-text>
      </md-card-header>

      <md-card-actions>
        <router-link
          tag="md-button"
          :to="{ name: 'BoardQuality', params: { boardId: board.id } }"
        >
          qualité
        </router-link>
        <router-link
          tag="md-button"
          :to="{ name: 'BoardView', params: { boardId: board.id } }"
        >
          comment
        </router-link>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Board } from '@/models/Board'
import { trelloService } from '@/services/trello.service'

@Component
export default class SelectBoard extends Vue {
  private boards: Board[] = []

  private mounted() {
    this.getBoards()
  }

  private async getBoards() {
    this.boards = await trelloService.getBoards()
  }
}
</script>

<style scoped lang="scss">
.select-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;

  .board-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
