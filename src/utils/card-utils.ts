import stringSimilarity from 'string-similarity'

import { ChecklistItem } from '@/models/ChecklistItem'
import { Checklist } from '@/models/Checklist'
import { Card } from '@/models/Card'
import { CardScore } from '@/models/CardScore'

export const getComplexityFromCardName = (cardName: string): number | null => {
  const regExp = /\(([^)]+)\)/
  const matches = regExp.exec(cardName)
  if (!matches) {
    return null
  }
  const [, complexity] = matches
  return parseFloat(complexity)
}

interface OrderedMatches<T> {
  [key: string]: {
    entity: T
    score: number
  }
}

const getHowByHowItemName = (
  hows: Checklist[],
  name: string
): Checklist | null => {
  return (
    hows.find((how) =>
      how.checkItems.map((item) => item.name).includes(name)
    ) ?? null
  )
}

const getCardByCardId = (cards: Card[], cardId: string): Card | null => {
  return cards.find((card) => card.id === cardId) ?? null
}

const getSimilarHows = (
  newHow: string,
  hows: Checklist[],
  howItems: ChecklistItem[]
): OrderedMatches<Checklist> => {
  if (!newHow) {
    return {}
  }

  const howItemNames = howItems.map((howItem) => howItem.name)

  const similarities = stringSimilarity.findBestMatch(newHow, howItemNames)
  const similiarNameMatches: OrderedMatches<string> = similarities.ratings.reduce(
    (obj: OrderedMatches<string>, similarity) => ({
      ...obj,
      [similarity.target]: {
        entity: similarity.target,
        score: Math.max(obj[similarity.target]?.score ?? 0, similarity.rating)
      }
    }),
    {}
  )

  const targetMatches = Object.keys(similiarNameMatches)

  if (!targetMatches.length) {
    return {}
  }

  const similarHowItems: OrderedMatches<Checklist> = howItems
    .filter((item) => targetMatches.includes(item.name))
    .reduce(
      (obj: OrderedMatches<Checklist>, item) => ({
        ...obj,
        [item.idChecklist]: {
          entity:
            obj[item.idChecklist]?.entity ??
            getHowByHowItemName(hows, item.name),
          score: Math.max(
            obj[item.idChecklist]?.score ?? 0,
            similiarNameMatches[item.name].score
          )
        }
      }),
      {}
    )

  return similarHowItems
}

interface GetSimilarCardsProps {
  newHowItem: string
  hows: Checklist[]
  howItems: ChecklistItem[]
  cards: Card[]
}

export const getSimilarCards = ({
  newHowItem,
  hows,
  howItems,
  cards
}: GetSimilarCardsProps): OrderedMatches<Card> => {
  const similarHows = getSimilarHows(newHowItem, hows, howItems)
  const bestHowIds = Object.keys(similarHows)

  if (!bestHowIds.length) {
    return {}
  }

  const similarCards: OrderedMatches<Card> = Object.values(similarHows).reduce(
    (obj: OrderedMatches<Card>, item) => ({
      ...obj,
      [item.entity.idCard]: {
        entity:
          obj[item.entity.idCard]?.entity ||
          getCardByCardId(cards, item.entity.idCard),
        score: Math.max(obj[item.entity.idCard]?.score ?? 0, item.score)
      }
    }),
    {}
  )

  return similarCards
}

const getCardScore = (
  cardId: string,
  ...similarCardCollections: OrderedMatches<Card>[]
): number => {
  let score = 0

  similarCardCollections.forEach((collection) => {
    score = Math.max(collection[cardId]?.score ?? 0, score)
  })

  return Number(score.toFixed(2))
}

export const getBestSimilarCards = (
  ...similarCardCollections: OrderedMatches<Card>[]
): CardScore[] => {
  let mergedCollections: OrderedMatches<Card> = {}

  similarCardCollections.forEach((similarCard) => {
    mergedCollections = { ...mergedCollections, ...similarCard }
  })

  for (const cardId in mergedCollections) {
    mergedCollections[cardId].score = getCardScore(
      cardId,
      ...similarCardCollections
    )
  }

  return Object.values(mergedCollections)
    .filter((card) => !!card.entity)
    .sort((a, b) =>
      mergedCollections[a.entity.id].score >
      mergedCollections[b.entity.id].score
        ? -1
        : 1
    )
}
