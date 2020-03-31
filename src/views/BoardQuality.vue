<template>
  <div class="board-quality" v-if="board">
    <h1>
      {{ board.name }}
      <router-link
        tag="md-button"
        :to="{ name: 'BoardView', params: { boardId: board.id } }"
      >
        comment
      </router-link>
    </h1>
    <md-field>
      <label>Database URL</label>
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

    const labels = perfs.map((perf) => new Date(perf.date).toLocaleDateString())
    const colors = kaizens.map((_, i) => `hsl(${33 * i}, 55%, 65%)`)
    const darkenColors = kaizens.map((_, i) => `hsl(${33 * i}, 55%, 45%)`)

    const datasets = kaizens.map((kaizen, i) => {
      return {
        label: kaizen,
        data: perfs.map((perf) => perf.labels[kaizen] || 0),
        borderColor: colors[i],
        backgroundColor: colors[i]
      }
    })

    const diffDatasets = kaizens.map((kaizen, i) => {
      return {
        label: kaizen,
        data: perfs.map(
          (perf, perfIndex) =>
            (perf.labels[kaizen] || 0) -
            (perfs[perfIndex - 1]?.labels[kaizen] || 0)
        ),
        borderColor: darkenColors[i],
        backgroundColor: 'rgba(0,0,0,0)',
        type: 'line'
      }
    })

    if (this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart(this.$refs.perf as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [...diffDatasets, ...datasets]
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
