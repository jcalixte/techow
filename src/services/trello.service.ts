// eslint-disable-next-line
declare const Trello: any

import { Board } from '@/models/Board'
import { List } from '@/models/List'
import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'

class TrelloService {
  private baseurl = 'https://api.trello.com/1'
  private _apiToken = localStorage.getItem('trello_token')
  private apiKey = 'fe42bb09f1f31d462aa86f66aa4fa1ae'

  private get apiToken() {
    if (!this._apiToken) {
      this._apiToken = localStorage.getItem('trello_token')
    }

    return this._apiToken
  }

  public get isAuthenticated(): boolean {
    return !!this.apiToken
  }

  public askPermission() {
    Trello.authorize({
      type: 'popup',
      name: 'Tech How',
      scope: {
        read: 'true',
        write: 'true'
      },
      expiration: 'never',
      success: this.authenticationSuccess,
      error: this.authenticationFailure
    })
  }

  public authenticationSuccess() {
    this._apiToken = localStorage.getItem('trello_token')
  }

  public authenticationFailure() {
    this._apiToken = ''
  }

  public async getBoards(): Promise<Board[]> {
    const response = await fetch(
      `${this.baseurl}/members/me/boards?key=${this.apiKey}&token=${this.apiToken}`
    )
    return await response.json()
  }

  public async getLists(boardId: string): Promise<List[]> {
    const response = await fetch(
      `${this.baseurl}/boards/${boardId}/lists?key=${this.apiKey}&token=${this.apiToken}`
    )
    return await response.json()
  }

  public async getBoardChecklists(boardId: string): Promise<Checklist[]> {
    const response = await fetch(
      `${this.baseurl}/boards/${boardId}/checklists?key=${this.apiKey}&token=${this.apiToken}`
    )
    return await response.json()
  }

  public async getCards(listId: string): Promise<Card[]> {
    const response = await fetch(
      `${this.baseurl}/lists/${listId}/cards?key=${this.apiKey}&token=${this.apiToken}`
    )
    return await response.json()
  }

  public async getChecklist(cardId: string): Promise<Checklist[]> {
    const response = await fetch(
      `${this.baseurl}/cards/${cardId}/checklists?key=${this.apiKey}&token=${this.apiToken}`
    )
    return await response.json()
  }

  public async createHow(cardId: string): Promise<Checklist> {
    const qs = {
      idCard: cardId,
      key: this.apiKey,
      token: this.apiToken
    }
    const response = await fetch(`${this.baseurl}/checklists?${this.qs(qs)}`, {
      method: 'POST'
    })
    return await response.json()
  }

  private qs(qs: { [key: string]: string | null | number }): string {
    return Object.keys(qs)
      .map((key) => `${key}=${qs[key]}`)
      .join('&')
  }
}

export const trelloService = new TrelloService()
