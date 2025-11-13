// Test the Physical disability tag mapping

const TAG_NAME_TO_ID = {
  "Physical disability": ["09Q2FEVzWlOBc5AqoypO", "QCMHvYz9oUPPPhOsXDek", "YI6XgFxHn8x4LYzkHkIM"]
};

function normalizeKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function looksLikeId(t) {
  return /^[A-Za-z0-9_-]{15,}$/.test(t);
}

function getTagCode(tag) {
  if (!tag && tag !== 0) return null;
  const raw = String(tag).trim();

  // If input already looks like an ID, return it as-is
  if (looksLikeId(raw)) return raw;

  // Strip leading '#' and normalize
  const stripped = raw.startsWith('#') ? raw.substring(1) : raw;
  const key = normalizeKey(stripped);

  console.log('Testing getTagCode with:', JSON.stringify(tag));
  console.log('Raw:', JSON.stringify(raw));
  console.log('Stripped:', JSON.stringify(stripped));
  console.log('Normalized key:', JSON.stringify(key));

  // Try exact match first
  if (TAG_NAME_TO_ID.hasOwnProperty(stripped)) {
    const result = TAG_NAME_TO_ID[stripped];
    console.log('Exact match found:', result);
    console.log('Is array?', Array.isArray(result));
    return result;
  }
  
  // Try normalized matches
  for (const k of Object.keys(TAG_NAME_TO_ID)) {
    const normalizedK = normalizeKey(k);
    console.log('Checking normalized:', JSON.stringify(k), '->', JSON.stringify(normalizedK), 'vs', JSON.stringify(key));
    if (normalizedK === key) {
      const result = TAG_NAME_TO_ID[k];
      console.log('Normalized match found:', result);
      console.log('Is array?', Array.isArray(result));
      return result;
    }
  }
  
  console.log('No match found');
  return null;
}

// Test the function
console.log('=== TESTING getTagCode("Physical disability") ===');
const result = getTagCode('Physical disability');
console.log('\nFinal result:', result);
console.log('Result type:', typeof result);
console.log('Is array?', Array.isArray(result));

if (Array.isArray(result)) {
  console.log('Array contents:');
  result.forEach((id, index) => {
    console.log('  ' + (index + 1) + ': ' + id);
  });
} else {
  console.log('Single result:', result);
}

// Test addTag simulation
console.log('\n=== TESTING addTag simulation ===');
let allTags = new Set();

function addTag(tag) {
  if (typeof tag === 'string') {
    const tagResult = getTagCode(tag);
    console.log('addTag called with:', JSON.stringify(tag));
    console.log('getTagCode returned:', tagResult);
    
    if (tagResult) {
      if (Array.isArray(tagResult)) {
        console.log('Adding array of IDs:', tagResult);
        tagResult.forEach(id => {
          console.log('  Adding ID to Set:', id);
          allTags.add(id);
        });
      } else {
        console.log('Adding single ID:', tagResult);
        allTags.add(tagResult);
      }
    }
  }
}

addTag('Physical disability');
console.log('\nFinal allTags Set:', Array.from(allTags));
console.log('Total tags added:', allTags.size);
