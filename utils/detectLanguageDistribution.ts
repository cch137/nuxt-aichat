function detectLanguageDistribution(text: string, sampleMinSize = 100, sampleProportion = 0.1): { [languageCode: string]: number } {
  // Step 1: Remove whitespace characters from the text
  const cleanedText = text.replace(/\s/g, '');

  // Step 2: Determine the number of characters to select based on the text length
  let sampleSize: number;
  if (cleanedText.length < sampleMinSize) {
    sampleSize = cleanedText.length;
  } else if (cleanedText.length < sampleMinSize / sampleProportion) {
    sampleSize = sampleMinSize;
  } else {
    sampleSize = Math.floor(cleanedText.length * sampleProportion);
  }

  // Step 3: Randomly select the characters' indices
  let selectedIndices: number[] = [];
  if (sampleSize < cleanedText.length) {
    selectedIndices = getRandomIndices(sampleSize, cleanedText.length);
  }

  // Helper function to generate unique random indices
  function getRandomIndices(count: number, max: number): number[] {
    const indices = new Set<number>();
    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * max);
      indices.add(randomIndex);
    }
    return Array.from(indices);
  }

  // If we need to select all characters, selectedIndices will be empty,
  // so we set selectedIndices to include all indices from 0 to cleanedText.length - 1.
  if (selectedIndices.length === 0) {
    for (let i = 0; i < cleanedText.length; i++) {
      selectedIndices.push(i);
    }
  }

  // Step 4: Detect the language of selected characters using Unicode ranges
  const languageCodeRanges: { [languageCode: string]: [number, number][] } = {
    en: [[0x0000, 0x007F]], // Basic Latin (ASCII)
    zh: [[0x4E00, 0x9FFF], [0x3400, 0x4DBF], [0x20000, 0x2A6DF], [0x2A700, 0x2B73F], [0x2B740, 0x2B81F]], // Chinese
    ja: [[0x3040, 0x309F], [0x30A0, 0x30FF], [0x31F0, 0x31FF], [0x1B000, 0x1B0FF], [0x1F200, 0x1F2FF]], // Japanese
    ko: [[0xAC00, 0xD7AF]], // Korean
    // Add more languages and their corresponding Unicode ranges as needed
  };

  const characterCounts: { [character: string]: number } = {};
  selectedIndices.forEach((index) => {
    const character = cleanedText[index];
    if (!characterCounts[character]) {
      characterCounts[character] = 0;
    }
    characterCounts[character]++;
  });

  const languageDistribution: { [languageCode: string]: number } = {};

  for (const character in characterCounts) {
    let detectedLanguageCode = 'other';
    for (const languageCode in languageCodeRanges) {
      let isCharacterInRange = false;
      languageCodeRanges[languageCode].forEach((range) => {
        if (character.charCodeAt(0) >= range[0] && character.charCodeAt(0) <= range[1]) {
          isCharacterInRange = true;
        }
      });
      if (isCharacterInRange) {
        detectedLanguageCode = languageCode;
        break;
      }
    }

    if (!languageDistribution[detectedLanguageCode]) {
      languageDistribution[detectedLanguageCode] = 0;
    }
    languageDistribution[detectedLanguageCode] += characterCounts[character];
  }

  // Step 5: Calculate the language distribution percentages
  const totalCharacters = selectedIndices.length;
  for (const languageCode in languageDistribution) {
    languageDistribution[languageCode] /= totalCharacters;
  }

  return languageDistribution;
}

export default detectLanguageDistribution;
