import type { CardDTO } from "../types";

import { UNSPOKEN_CONFESSION_CARDS } from "./unspoken_confession";
import { FUN_CARDS } from "./fun";
import { DEEP_CARDS } from "./deep";
import { LITTLE_LOVE_CARDS } from "./little_love";
import { DELULU_ROMANCE_CARDS } from "./delulu_romance";
import { SPARK_CARDS } from "./spark";
import { WILDCARDS_CARDS } from "./wildcards";

export const CARDS: CardDTO[] = [
  ...UNSPOKEN_CONFESSION_CARDS,
  ...FUN_CARDS,
  ...DEEP_CARDS,
  ...LITTLE_LOVE_CARDS,
  ...DELULU_ROMANCE_CARDS,
  ...SPARK_CARDS,
  ...WILDCARDS_CARDS,
];
