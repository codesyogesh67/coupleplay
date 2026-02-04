import type { CardDTO } from "../types";

import { WARMUP_CARDS } from "./warmup";
import { FUN_CARDS } from "./fun";
import { DEEP_CARDS } from "./deep";
import { FUTURE_CARDS } from "./future";

export const CARDS: CardDTO[] = [
  ...WARMUP_CARDS,
  ...FUN_CARDS,
  ...DEEP_CARDS,
  ...FUTURE_CARDS,
];
