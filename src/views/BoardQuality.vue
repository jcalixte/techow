<template>
  <div class="board-quality" v-if="board">
    <h1>{{ board.name }}</h1>
    <md-field>
      <label>CouchDb URL</label>
      <md-input v-model="baseUrl"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="postNewData">
      mise à jour
    </md-button>

    <canvas ref="perf"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import Chart from 'chart.js'
import { trelloService } from '@/services/trello.service'
import { qualityService } from '@/services/quality.service'
import { Board } from '@/models/Board'
import { Card } from '@/models/Card'
import { Perf } from '@/models/Perf'

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
  perfs: Perf[] = []
  baseUrl = qualityService.baseDbUrl
  chart: typeof Chart | null = null

  async mounted() {
    this.board = await trelloService.getBoard(this.boardId)
    this.perfs = await qualityService.getPerfs(this.boardId)
    this.initChart(this.perfs)
  }

  async postNewData() {
    await qualityService.postNewData(this.boardId)
    this.perfs = await qualityService.getPerfs(this.boardId)
    this.initChart(this.perfs)
  }

  @Watch('baseUrl')
  onBaseUrlChange(baseUrl: string) {
    qualityService.baseDbUrl = baseUrl
  }

  initChart(perfs: Perf[]) {
    if (!perfs || !perfs.length) {
      return
    }
    perfs.sort((a, b) => (a.date < b.date ? -1 : 1))
    const kaizens = [
      ...new Set(perfs.map((perf) => Object.keys(perf.labels)).flat())
    ]

    const colors = kaizens.map((_, i) => `hsl(${20 * i}, 55%, 65%)`)

    const datasets = kaizens.map((kaizen) => {
      return {
        label: kaizen,
        data: perfs.map((perf) => perf.labels[kaizen] || 0),
        backgroundColor: colors
      }
    })

    const labels = perfs.map((perf) => new Date(perf.date).toLocaleDateString())

    if (this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart(this.$refs.perf as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }
}
</script>
