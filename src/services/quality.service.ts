import Vue from 'vue'
import PouchDB from 'pouchdb-browser'

import { trelloService } from '@/services/trello.service'
import { Card } from '@/models/Card'
import { Perf, Label } from '@/models/Perf'

class QualityService {
  private _baseDbUrl = localStorage.getItem('db_url')

  private get database() {
    if (!this.baseDbUrl) {
      return null
    }

    return new PouchDB(this.baseDbUrl)
  }

  public get baseDbUrl() {
    if (!this._baseDbUrl) {
      this._baseDbUrl = localStorage.getItem('db_url')
    }

    return this._baseDbUrl || ''
  }

  public set baseDbUrl(baseDbUrl: string) {
    localStorage.setItem('db_url', baseDbUrl)
  }

  public async getKaizenCards(boardId: string): Promise<Card[]> {
    const kaizenCards = (
      await trelloService.getBoardCards(boardId)
    ).filter((card) =>
      card.labels.some((label) => label.name.toLowerCase().includes('kaizen'))
    )

    return kaizenCards
  }

  public async postNewData(boardId: string): Promise<void> {
    if (!this.database) {
      return
    }
    const kaizenCards = await this.getKaizenCards(boardId)

    const _id = `${boardId}-${this.today()}`
    let previousPerf: Perf

    try {
      previousPerf = await this.database.get(_id)
      previousPerf.labels = {}
    } catch (error) {
      previousPerf = {
        _id,
        date: new Date(),
        labels: {}
      }
    }

    const perf: Perf = kaizenCards.reduce((p: Perf, card: Card) => {
      const kaizenLabels = card.labels.filter((label) =>
        label.name.toLowerCase().includes('kaizen')
      )

      const newPerf: Label = {}
      for (const label of kaizenLabels) {
        newPerf[label.name] = (p.labels[label.name] || 0) + 1
      }

      return {
        ...p,
        date: new Date(),
        labels: {
          ...p.labels,
          ...newPerf
        }
      }
    }, previousPerf)

    await this.database.put(perf)
    Vue.notify({
      group: 'notification',
      title: `Donnée mise à jour pour aujourd'hui`,
      type: 'success'
    })
  }

  public async getPerfs(boardId: string): Promise<Perf[]> {
    if (!this.database) {
      return []
    }

    const result = await this.database.allDocs({
      include_docs: true,
      startkey: boardId,
      endkey: `${boardId}\ufff0`
    })

    return (result.rows.map((row) => row.doc) as unknown) as Perf[]
  }

  private today() {
    const today = new Date()
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  }
}

export const qualityService = new QualityService()
