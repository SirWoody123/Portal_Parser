// Direct test of the parseTextFile function
const fs = require('fs');

/**
 * Parses text file format into JSON structure expected by transformData().
 * Handles key: value pairs and converts demographic text values into proper arrays.
 * @param {string} textContent The raw text content from the file.
 * @returns {Object} The parsed JSON structure.
 */
const parseTextFile = (textContent) => {
  console.log('🔍 TEXT PARSER: Starting text file parsing...');
  
  const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);
  const result = {
    title: '',
    description: '',
    link: '',
    applicationDeadline: '',
    location: '',
    remote: false,
    ukWide: false,
    opportunityType: 'Opportunity',
    demographic: {
      industry: [],
      age: [],
      genderSexualPreference: [],
      ethnicity: [],
      disability: [],
      lowerSocioEconomicBackground: []
    }
  };

  lines.forEach(line => {
    if (!line.includes(':')) return;
    
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();
    
    console.log(`🔍 TEXT PARSER: Processing "${key.trim()}" = "${value}"`);
    
    switch (key.trim()) {
      case 'Application Deadline':
        result.applicationDeadline = value;
        break;
        
      case 'Location':
        result.location = value;
        break;
        
      case 'Important Details':
        result.description = value;
        // Extract title from first sentence if available
        if (!result.title && value) {
          const firstSentence = value.split('.')[0];
          if (firstSentence.length < 100) {
            result.title = firstSentence.trim();
          } else {
            result.title = value.substring(0, 80) + '...';
          }
        }
        break;
        
      case 'Remote':
        result.remote = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'UK Wide':
        result.ukWide = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'Industry':
        // Split comma-separated values and clean them
        result.demographic.industry = value.split(',')
          .map(item => item.trim())
          .filter(item => item);
        console.log(`🔍 TEXT PARSER: Parsed industries:`, result.demographic.industry);
        break;
        
      case 'Age':
        // Handle "All ages" or specific age ranges
        if (value.toLowerCase() === 'all ages') {
          result.demographic.age = ['All ages'];
        } else {
          result.demographic.age = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed ages:`, result.demographic.age);
        break;
        
      case 'Gender & Sexual Preference':
        if (value.toLowerCase() === 'all genders & preferences') {
          result.demographic.genderSexualPreference = ['All genders & preferences'];
        } else {
          result.demographic.genderSexualPreference = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed gender & sexual preference:`, result.demographic.genderSexualPreference);
        break;
        
      case 'Ethnicity':
        if (value.toLowerCase() === 'all ethnicities') {
          result.demographic.ethnicity = ['All ethnicities'];
        } else {
          result.demographic.ethnicity = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed ethnicities:`, result.demographic.ethnicity);
        break;
        
      case 'Opportunity Type':
        result.opportunityType = value;
        break;
        
      case 'Disability':
        if (value.toLowerCase() === 'all disability') {
          result.demographic.disability = ['All disability'];
        } else {
          result.demographic.disability = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed disability:`, result.demographic.disability);
        break;
        
      case 'Economic Background':
        if (value.toLowerCase() === 'all backgrounds') {
          result.demographic.lowerSocioEconomicBackground = ['All backgrounds'];
        } else {
          result.demographic.lowerSocioEconomicBackground = value.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
        console.log(`🔍 TEXT PARSER: Parsed economic background:`, result.demographic.lowerSocioEconomicBackground);
        break;
        
      case 'Region':
        // Add region to location if not already set
        if (!result.location) {
          result.location = value;
        }
        break;
        
      case 'Link':
        result.link = value;
        break;
        
      default:
        console.log(`🔍 TEXT PARSER: Unhandled field "${key.trim()}" = "${value}"`);
        break;
    }
  });

  // Set default title if still empty
  if (!result.title) {
    result.title = 'Opportunity';
  }

  console.log('🔍 TEXT PARSER: Final parsed result:', JSON.stringify(result, null, 2));
  return result;
};

// Test the function with the sample data
console.log('🧪 TESTING TEXT PARSER FUNCTION...\n');

const testContent = fs.readFileSync('/Users/woody123/Desktop/Portal_Parser-patch25/test-dept-designers.txt', 'utf8');
console.log('📄 INPUT TEXT CONTENT:');
console.log(testContent);
console.log('\n🔄 PARSING...\n');

const result = parseTextFile(testContent);

console.log('\n✅ FINAL RESULT:');
console.log('================');
console.log('Title:', result.title);
console.log('Description length:', result.description.length);
console.log('Link:', result.link);
console.log('Application Deadline:', result.applicationDeadline);
console.log('Location:', result.location);
console.log('Remote:', result.remote);
console.log('UK Wide:', result.ukWide);
console.log('Opportunity Type:', result.opportunityType);
console.log('\nDemographics:');
console.log('- Industry:', result.demographic.industry);
console.log('- Age:', result.demographic.age);
console.log('- Gender & Sexual Preference:', result.demographic.genderSexualPreference);
console.log('- Ethnicity:', result.demographic.ethnicity);
console.log('- Disability:', result.demographic.disability);
console.log('- Economic Background:', result.demographic.lowerSocioEconomicBackground);

console.log('\n🎉 TEXT PARSING TEST COMPLETE!');
