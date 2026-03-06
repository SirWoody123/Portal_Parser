// Test the Google Script text parsing function with the marketing internship data
const fs = require('fs');

// Google Script text parser function (converted to Node.js)
function parseTextFileInGoogleScript(textContent) {
  console.log('🔍 TEXT PARSER (Google Script): Starting text file parsing...');
  
  const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);
  const result = {
    title: '',
    description: '',
    shortSummary: '',
    link: '',
    applicationDeadline: '',
    location: '',
    remote: false,
    ukWide: false,
    opportunityType: 'Internship', // Default for this type of content
    salary: '',
    lengthOfApprenticeship: '',
    lengthOfInternship: '',
    anythingElseImportant: '',
    tags: {
      industry: [],
      keywords: []
    }
  };

  lines.forEach(line => {
    if (!line.includes(':')) return;
    
    const parts = line.split(':');
    const key = parts[0].trim();
    const value = parts.slice(1).join(':').trim();
    
    console.log(`🔍 TEXT PARSER: Processing "${key}" = "${value}"`);
    
    switch (key) {
      case 'Salary':
        result.salary = value;
        break;
        
      case 'Length of internship & start date/ month':
      case 'Length of internship':
        result.lengthOfInternship = value;
        break;
        
      case 'Application deadline':
        result.applicationDeadline = value;
        break;
        
      case 'Location':
        result.location = value;
        break;
        
      case 'Anything else important':
        result.anythingElseImportant = value;
        result.shortSummary = value.length > 200 ? value.substring(0, 200) + '...' : value;
        break;
        
      case 'Link':
        result.link = value;
        break;
        
      case 'Remote':
        result.remote = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'UK Wide':
        result.ukWide = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
        break;
        
      case 'Industry':
        // Split comma-separated values and clean them
        result.tags.industry = value.split(',')
          .map(item => item.trim())
          .filter(item => item);
        console.log('🔍 TEXT PARSER: Parsed industries:', result.tags.industry);
        break;
        
      case 'Age':
        // Add age to keywords for demographic processing
        result.tags.keywords.push(value);
        console.log('🔍 TEXT PARSER: Added age to keywords:', value);
        break;
        
      case 'Gender & Sexual Preference':
        // Add gender to keywords for demographic processing
        result.tags.keywords.push(value);
        console.log('🔍 TEXT PARSER: Added gender to keywords:', value);
        break;
        
      case 'Ethnicity':
        // Add ethnicity to keywords for demographic processing
        result.tags.keywords.push(value);
        console.log('🔍 TEXT PARSER: Added ethnicity to keywords:', value);
        break;
        
      case 'Disability':
        // Add disability to keywords for demographic processing
        result.tags.keywords.push(value);
        console.log('🔍 TEXT PARSER: Added disability to keywords:', value);
        break;
        
      case 'Economic Background':
        // Add economic background to keywords for demographic processing
        result.tags.keywords.push(value);
        console.log('🔍 TEXT PARSER: Added economic background to keywords:', value);
        break;
        
      case 'Region':
        // Use region info if no specific location
        if (!result.location || result.location === '') {
          result.location = value;
        }
        break;
        
      default:
        console.log(`🔍 TEXT PARSER: Unhandled field "${key}" = "${value}"`);
        break;
    }
  });

  // Generate title if not set
  if (!result.title) {
    const industryText = result.tags.industry.length > 0 ? result.tags.industry[0] : 'Opportunity';
    result.title = industryText + ' Internship';
  }
  
  // Add some basic keywords
  result.tags.keywords = result.tags.keywords.concat(['internship', 'opportunity']);

  console.log('🔍 TEXT PARSER (Google Script): Final parsed result:', JSON.stringify(result, null, 2));
  return result;
}

// Test with the marketing internship data
console.log('🧪 TESTING GOOGLE SCRIPT TEXT PARSER...\n');

const testContent = fs.readFileSync('/Users/woody123/Desktop/Portal_Parser-patch25/test-marketing-pr-intern.txt', 'utf8');
const result = parseTextFileInGoogleScript(testContent);

console.log('\n✅ GOOGLE SCRIPT PARSING RESULT:');
console.log('==================================');
console.log('Title:', result.title);
console.log('Salary:', result.salary);
console.log('Application Deadline:', result.applicationDeadline);
console.log('Location:', result.location);
console.log('Link:', result.link);
console.log('Remote:', result.remote);
console.log('UK Wide:', result.ukWide);
console.log('Length of Internship:', result.lengthOfInternship);
console.log('Anything Else Important:', result.anythingElseImportant ? 'SET' : 'EMPTY');
console.log('Industries:', result.tags.industry);
console.log('Keywords:', result.tags.keywords);

console.log('\n📊 VERIFICATION:');
console.log('- ✅ Basic fields extracted:', !!(result.salary && result.applicationDeadline && result.link));
console.log('- ✅ Demographics in keywords:', result.tags.keywords.some(k => k.includes('All')));
console.log('- ✅ Ready for Google Script normalization');

console.log('\n🎉 GOOGLE SCRIPT TEXT PARSER TEST COMPLETE!');
