function concentrate(text, targetLength) {
  const textLength = text.length;
  if (textLength <= targetLength)
    return text;
  let step = Math.ceil(textLength / targetLength), j = 0, k, l;
  const selected = Array.from({ length: textLength }).map((v, i) => i % step === 0 ? (j++, true) : false);
  const remainder = targetLength - j;
  if (remainder !== 0) {
    step = Math.ceil(textLength / remainder);
    for (let i = 0; i < remainder; i++) {
      j = i * step + Math.ceil(step / 2), k = 0, l = 0;
      while (Math.abs(l) < textLength) {
        if (l >= 0 && !selected[l]) {
          selected[l] = true;
          break;
        }
        k = k >= 0 ? -(k + 1) : k = -k;
        l = j + k;
      }
    }
  }
  return text.split("").filter((v, i) => selected[i]).join("");
}
const languageCodeRanges = {
  en: [[0, 127]],
  // Basic Latin (ASCII)
  zh: [[19968, 40959], [13312, 19903], [131072, 173791], [173824, 177983], [177984, 178207]],
  // Chinese
  ja: [[12352, 12447], [12448, 12543], [12784, 12799], [110592, 110847], [127488, 127743]],
  // Japanese
  ko: [[44032, 55215]],
  // Korean
  ru: [[1024, 1279], [1280, 1327]]
  // Russian
  // Add more languages and their corresponding Unicode ranges as needed
};
function analyzeLanguages(text, sampleProportion = 0.1, minSampleSize = 100, maxSampleSize = 1e3) {
  const selectedCharacters = concentrate(
    text.replace(/\s/g, ""),
    Math.floor(Math.min(maxSampleSize, Math.max(minSampleSize, text.length * sampleProportion)))
  ).split("");
  const languageDistribution = {};
  let detectedTotal = 0, detected;
  for (const character of selectedCharacters) {
    detected = false;
    for (const languageCode in languageCodeRanges) {
      for (const characterRange of languageCodeRanges[languageCode]) {
        if (character.charCodeAt(0) >= characterRange[0] && character.charCodeAt(0) <= characterRange[1]) {
          if (languageCode in languageDistribution)
            languageDistribution[languageCode]++;
          else
            languageDistribution[languageCode] = 1;
          detectedTotal++;
          detected = true;
          break;
        }
      }
      if (detected)
        break;
    }
  }
  for (const languageCode in languageDistribution)
    languageDistribution[languageCode] /= detectedTotal;
  return languageDistribution;
}
function analyzeLanguage(text, sampleProportion = 0.1, minSampleSize = 100, maxSampleSize = 1e3) {
  const data = analyzeLanguages(text, sampleProportion, minSampleSize, maxSampleSize);
  let language = null, v = 0;
  for (const languageCode in data) {
    const u = data[languageCode];
    if (u > v)
      language = languageCode, v = u;
  }
  return language || "en";
}

export { analyzeLanguages as a, analyzeLanguage as b };
//# sourceMappingURL=analyzeLanguages.mjs.map
