<template>
  <md-card class="trello-card">
    <md-card-header>
      <div class="md-title">{{ card.name }}</div>
    </md-card-header>

    <md-card-content>
      <div v-for="checklist in cardChecklists" :key="checklist.id">
        <ol>
          <li v-for="item in checklist.checkItems" :key="item.id">
            {{ item.name }}
          </li>
        </ol>
      </div>
    </md-card-content>

    <md-card-actions>
      <md-button :href="card.shortUrl">Trello</md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Card } from '@/models/Card'
import { Getter } from 'vuex-class'
import { Checklist } from '../models/Checklist'

@Component
export default class TrelloCard extends Vue {
  @Prop()
  private card!: Card
  @Getter
  private hows!: Checklist[]

  private get cardChecklists() {
    return this.hows.filter((how) => how.idCard === this.card.id)
  }
}
</script>

<style scoped lang="scss">
.trello-card {
  li {
    word-break: break-all;
  }
}
</style>
