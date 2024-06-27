function concentrate(text: string, targetLength: number) {
  const textLength = text.length;
  if (textLength <= targetLength) return text;
  let step = Math.ceil(textLength / targetLength),
    j = 0,
    k: number,
    l: number;
  const selected = Array.from({ length: textLength }).map((v, i) =>
    i % step === 0 ? (j++, true) : false
  );
  const remainder = targetLength - j;
  if (remainder !== 0) {
    step = Math.ceil(textLength / remainder);
    for (let i = 0; i < remainder; i++) {
      (j = i * step + Math.ceil(step / 2)), (k = 0), (l = 0);
      while (Math.abs(l) < textLength) {
        if (l >= 0 && !selected[l]) {
          selected[l] = true;
          break;
        }
        k = k >= 0 ? -(k + 1) : (k = -k);
        l = j + k;
      }
    }
  }
  return text
    .split("")
    .filter((v, i) => selected[i])
    .join("");
}

const languageCodeRanges: { [languageCode: string]: [number, number][] } = {
  en: [[0x0000, 0x007f]], // Basic Latin (ASCII)
  zh: [
    [0x4e00, 0x9fff],
    [0x3400, 0x4dbf],
    [0x20000, 0x2a6df],
    [0x2a700, 0x2b73f],
    [0x2b740, 0x2b81f],
  ], // Chinese
  ja: [
    [0x3040, 0x309f],
    [0x30a0, 0x30ff],
    [0x31f0, 0x31ff],
    [0x1b000, 0x1b0ff],
    [0x1f200, 0x1f2ff],
  ], // Japanese
  ko: [[0xac00, 0xd7af]], // Korean
  ru: [
    [0x0400, 0x04ff],
    [0x0500, 0x052f],
  ], // Russian
  // Add more languages and their corresponding Unicode ranges as needed
};

function analyzeLanguages(
  text: string,
  sampleProportion = 0.1,
  minSampleSize = 100,
  maxSampleSize = 1000
) {
  const selectedCharacters = concentrate(
    text.replace(/\s/g, ""),
    Math.floor(
      Math.min(
        maxSampleSize,
        Math.max(minSampleSize, text.length * sampleProportion)
      )
    )
  ).split("");
  const languageDistribution: { [languageCode: string]: number } = {};
  let detectedTotal = 0,
    detected: boolean;

  for (const character of selectedCharacters) {
    detected = false;
    for (const languageCode in languageCodeRanges) {
      for (const characterRange of languageCodeRanges[languageCode]) {
        if (
          character.charCodeAt(0) >= characterRange[0] &&
          character.charCodeAt(0) <= characterRange[1]
        ) {
          if (languageCode in languageDistribution)
            languageDistribution[languageCode]++;
          else languageDistribution[languageCode] = 1;
          detectedTotal++;
          detected = true;
          break;
        }
      }
      if (detected) break;
    }
  }

  for (const languageCode in languageDistribution)
    languageDistribution[languageCode] /= detectedTotal;

  return languageDistribution;
}

function analyzeLanguage(
  text: string,
  sampleProportion = 0.1,
  minSampleSize = 100,
  maxSampleSize = 1000
) {
  const data = analyzeLanguages(
    text,
    sampleProportion,
    minSampleSize,
    maxSampleSize
  );
  let language = null,
    v = 0;
  for (const languageCode in data) {
    const u = data[languageCode];
    if (u > v) (language = languageCode), (v = u);
  }
  return language || "en"; // default language is en
}

export { analyzeLanguage, analyzeLanguages };
