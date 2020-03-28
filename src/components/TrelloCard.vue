<template>
  <md-card class="trello-card">
    <md-card-header>
      <div class="md-title">{{ card.entity.name }}</div>
      <div class="md-subhead" v-if="card.score">
        Score de pertinence : {{ card.score.toLocaleString() }}
      </div>
    </md-card-header>

    <md-card-content>
      <div v-for="checklist in cardChecklists" :key="checklist.id">
        <h3>{{ checklist.name }}</h3>
        <ol>
          <li v-for="item in checklist.checkItems" :key="item.id">
            {{ item.name }}
          </li>
        </ol>
      </div>
    </md-card-content>

    <md-card-actions>
      <md-button :href="card.entity.shortUrl">trello</md-button>
    </md-card-actions>
  </md-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Checklist } from '@/models/Checklist'
import { CardScore } from '@/models/CardScore'

@Component
export default class TrelloCard extends Vue {
  @Prop()
  private card!: CardScore
  @Prop({ type: Boolean, default: false })
  private allChecklists!: boolean
  @Getter
  private checklists!: Checklist[]
  @Getter
  private hows!: Checklist[]

  private get cardChecklists() {
    return (this.allChecklists ? this.checklists : this.hows).filter(
      (how) => how.idCard === this.card.entity.id
    )
  }
}
</script>

<style lang="scss" scoped>
.trello-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
