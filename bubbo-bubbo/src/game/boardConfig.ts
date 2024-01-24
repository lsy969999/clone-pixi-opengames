import { randomItem } from "../utils/maths/rand";
import { designConfig } from "./designConfig";

const BUBBLE_TYPES = ['yellow', 'green', 'red', 'blue'];
const SPECIAL_BUBBLE_TYPES = ['bomb', 'super', 'timer'];

export type SpecialBubbleType = (typeof SPECIAL_BUBBLE_TYPES)[number];
export type RegularBubbleType = (typeof BUBBLE_TYPES)[number];

export type BubbleType = RegularBubbleType | SpecialBubbleType;

const INITIAL_BUBBLE_TYPES: BubbleType[] = ['red', 'green', 'blue'];

const MAX_BUBBLES_PER_LINE = 13

const BUBBLE_OVERFLOW = 0.5

const BUBBLE_SIZE = designConfig.content.width / MAX_BUBBLES_PER_LINE;

const bubbleTypeToColor: Record<RegularBubbleType, number> = {
  yellow: 0xffca42,
  green: 0x58ff2e,
  red: 0xff5f5f,
  blue: 0x6473ff,
}

export const boardConfig = {
  screenTop: -designConfig.content.height,
  minHeterogeneity: 0.5,
  heterogeneityIncrement: 0.01,
  startingLine: 10,
  specialBubbleEvery: 3,
  specialBubbleChance: 0.01,
  startingBubbleTypes: INITIAL_BUBBLE_TYPES,
  bubbleTypes: BUBBLE_TYPES,
  specialBubbleTypes: SPECIAL_BUBBLE_TYPES,
  bubbleTypeToColor,
  bubblesPerLine: MAX_BUBBLES_PER_LINE,
  bubbleSize: BUBBLE_SIZE,
  bubbleOverflow: BUBBLE_OVERFLOW,
  bounceLine: 145,
  maxAimLinesLength: 600,
  maxAimLines: 2,
  newLine: {
    animInTime: 3,
    urgentAnimInTime: 0.15,
    urgentMinLines: 8,
    animInDecrement: 0.05,
    maxDecrement: 1.5,
    decrementIn: 5,
  },
  scoreIncrement: 10,
  power: {
    blastRadius: 2,
    timerFreezeTime: 5,
  }
}

export function randomType(group?: 'all' | 'regular' | 'special') {
  switch (group) {
    case 'all':
      return randomItem([...boardConfig.specialBubbleTypes, ...boardConfig.bubbleTypes]);
    case 'special':
      return randomItem(boardConfig.specialBubbleTypes);
    default:
      return randomItem(boardConfig.bubbleTypes);
  }
}

export function isSpecialType(type: BubbleType) {
  return boardConfig.specialBubbleTypes.includes(type);
}