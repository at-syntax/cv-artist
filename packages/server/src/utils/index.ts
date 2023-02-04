import { consoleColorMap } from "../constants";

export const consoleColorTextGenerate = (color: keyof typeof consoleColorMap, text: string): string => {
  const getColor = consoleColorMap[color];
  return `\x1b[${getColor}m ${text} \x1b[0m`;
};
