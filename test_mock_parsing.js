// Test the mock content from the conversation to verify parsing works correctly
const mockContent = `Event Title: Test Arts Residency
Event Description: A residency program for emerging artists with specific demographic targeting
Application Deadline: December 6th, 2025
Industry Tags: Arts, Creative Industries
Gender & Sexual Preference: Women, Non-binary, LGBTQ+, He/Him, She/Her, They/Them
Age: 18-25, Over 18
Ethnicity: BAME, Black, Asian
Disability: Neurodiversity, Physical disability
Economic Background: Working class, Low income
Important details: This is a multi-line important details section
that should be captured properly
with all the content preserved.`;

// Simulate the Google Apps Script parsing logic
function simulateParseTextFile(content) {
  const result = {
    title: '',
    opportunity: '',
    applicationDeadline: '',
    tags: {
      industry: [],
      keywords: []
    },
    anythingElseImportant: ''
  };

  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(':')) continue;
    
    const parts = line.split(':');
    const key = parts[0].trim();
    let value = parts.slice(1).join(':').trim();
    
    // Handle multi-line content
    if (key === 'Important details') {
      const multiLineContent = [value];
      let j = i + 1;
      while (j < lines.length && !lines[j].includes(':')) {
        if (lines[j].trim()) {
          multiLineContent.push(lines[j]);
        }
        j++;
      }
      if (multiLineContent.length > 0) {
        value = multiLineContent.join('\n');
        i = j - 1; // Skip the lines we just processed
      }
    }
    
    console.log(`🔍 Processing "${key}" = "${value}"`);
    
    switch (key) {
      case 'Event Title':
        result.title = value;
        break;
        
      case 'Event Description':
        result.opportunity = value;
        break;
        
      case 'Application Deadline':
        // Handle ordinal dates like "December 6th, 2025"
        const cleanDate = value.replace(/(\d+)(st|nd|rd|th)/g, '$1');
        const parsedDate = new Date(cleanDate);
        if (!isNaN(parsedDate.getTime())) {
          result.applicationDeadline = parsedDate.toISOString();
        }
        break;
        
      case 'Industry Tags':
        if (value && value.trim()) {
          const industryValues = value.split(',').map(item => item.trim());
          result.tags.industry = result.tags.industry.concat(industryValues);
        }
        break;
        
      case 'Gender & Sexual Preference':
        if (value && value.trim()) {
          const genderValues = value.split(',').map(item => item.trim());
          result.tags.keywords = result.tags.keywords.concat(genderValues);
          console.log('🔍 Added gender values:', genderValues);
        }
        break;
        
      case 'Age':
        if (value && value.trim()) {
          const ageValues = value.split(',').map(item => item.trim());
          result.tags.keywords = result.tags.keywords.concat(ageValues);
          console.log('🔍 Added age values:', ageValues);
        }
        break;
        
      case 'Ethnicity':
        if (value && value.trim()) {
          const ethnicityValues = value.split(',').map(item => item.trim());
          result.tags.keywords = result.tags.keywords.concat(ethnicityValues);
          console.log('🔍 Added ethnicity values:', ethnicityValues);
        }
        break;
        
      case 'Disability':
        if (value && value.trim()) {
          const disabilityValues = value.split(',').map(item => item.trim());
          result.tags.keywords = result.tags.keywords.concat(disabilityValues);
          console.log('🔍 Added disability values:', disabilityValues);
        }
        break;
        
      case 'Economic Background':
        if (value && value.trim()) {
          const economicValues = value.split(',').map(item => item.trim());
          result.tags.keywords = result.tags.keywords.concat(economicValues);
          console.log('🔍 Added economic values:', economicValues);
        }
        break;
        
      case 'Important details':
        result.anythingElseImportant = value;
        break;
        
      default:
        console.log(`🔍 Unhandled field "${key}" = "${value}"`);
        if (result.anythingElseImportant) {
          result.anythingElseImportant += '\n' + key + ': ' + value;
        } else {
          result.anythingElseImportant = key + ': ' + value;
        }
        break;
    }
  }
  
  return result;
}

console.log('🧪 Testing mock content parsing...\n');
const result = simulateParseTextFile(mockContent);

console.log('\n🎯 Final parsed result:');
console.log('Title:', result.title);
console.log('Description:', result.opportunity);
console.log('Deadline:', result.applicationDeadline);
console.log('Industry tags:', result.tags.industry);
console.log('Keywords:', result.tags.keywords);
console.log('Important details:', result.anythingElseImportant);

console.log('\n✅ Analysis:');
console.log('- Should have individual demographic values instead of combined strings');
console.log('- Keywords array should contain:', ['Women', 'Non-binary', 'LGBTQ+', 'He/Him', 'She/Her', 'They/Them', '18-25', 'Over 18', 'BAME', 'Black', 'Asian', 'Neurodiversity', 'Physical disability', 'Working class', 'Low income']);
console.log('- Multi-line Important details should be captured properly');
console.log('- Event date parsing should handle ordinal suffixes (6th → 6)');
