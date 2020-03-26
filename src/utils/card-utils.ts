import stringSimilarity from 'string-similarity'

import { ChecklistItem } from '@/models/ChecklistItem'
import { Checklist } from '@/models/Checklist'
import { Card } from '@/models/Card'

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
  const SIMILARITY_THRESHOLD = 0.2

  const howItemNames = howItems.map((howItem) => howItem.name)

  const similarities = stringSimilarity.findBestMatch(newHow, howItemNames)
  const similiarNameMatches: OrderedMatches<string> = similarities.ratings
    .filter((rating) => rating.rating > SIMILARITY_THRESHOLD)
    .reduce(
      (obj: OrderedMatches<string>, similarity) => ({
        ...obj,
        [similarity.target]: {
          entity: similarity.target,
          score: obj[similarity.target]
            ? obj[similarity.target].score + similarity.rating
            : similarity.rating
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
          score:
            (obj[item.idChecklist]?.score ?? 0) +
            similiarNameMatches[item.name].score
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
        score: (obj[item.entity.idCard]?.score ?? 0) + item.score
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
    score += collection[cardId]?.score ?? 0
  })

  return score
}

export const getBestSimilarCards = (
  ...similarCardCollections: OrderedMatches<Card>[]
): Card[] => {
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
    .map((card) => card.entity)
    .filter((card) => !!card)
    .sort((a, b) =>
      mergedCollections[a.id].score > mergedCollections[b.id].score ? -1 : 1
    )
}
