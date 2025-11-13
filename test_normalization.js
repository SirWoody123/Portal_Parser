/**
 * Test Google Apps Script Normalization Function
 * This tests the normalizeOpportunityData function directly
 */

// Copy of the normalizeOpportunityData function from Google Apps Script
function normalizeOpportunityData(data) {
  // Helper functions
  function arr(val) { return Array.isArray(val) ? val : (val ? [val] : []); }
  function str(val) { return typeof val === 'string' ? val : ''; }
  function bool(val) { return typeof val === 'boolean' ? val : false; }
  function strOrNull(val) { return val === null ? null : str(val); }
  function id(val) { return typeof val === 'string' ? val : (val ? String(val) : ''); }

  // Extract industry tags from data.tags.industry or data.industry
  var industryTags = [];
  if (data.tags && Array.isArray(data.tags.industry)) {
    industryTags = data.tags.industry;
  } else if (Array.isArray(data.industry)) {
    industryTags = data.industry;
  }
  if (!industryTags) industryTags = [];

  // Extract keywords from data.tags.keywords or data.keywords
  var keywordsArr = [];
  if (data.tags && Array.isArray(data.tags.keywords)) {
    keywordsArr = data.tags.keywords.map(function(k) { return String(k); });
  } else if (Array.isArray(data.keywords)) {
    keywordsArr = data.keywords.map(function(k) { return String(k); });
  }
  if (!keywordsArr) keywordsArr = [];

  // Build tagsArr to include industry + keywords (not demographics - API server handles those)
  var tagsArr = [];
  tagsArr = tagsArr.concat(industryTags);
  tagsArr = tagsArr.concat(keywordsArr);

  // Define what "All" options expand to
  var allAgeOptions = ['21','22','23','24','25','Over 18','Under 18','Over 25','16 and under'];
  var allGenderOptions = ['He/Him', 'She/Her', 'They/Them', 'Non-binary', 'Transgender', 'Intersex', 'Other', 'Prefer not to say'];
  var allEthnicityOptions = ['White or White British', 'African, Caribbean or Black British', 'Asian or Asian British', 'Mixed or Multiple Ethnic group', 'Other Ethnic Group', 'Arab', 'Prefer not to say'];
  var allDisabilityOptions = ['Chronic illness', 'Hearing impairment', 'Neurodiversity', 'Physical disability', 'Visual impairment'];
  var allSocioEconomicOptions = ['20fXkU9RdlTlpfcS5K5D', 'V9J6aDjeQc7hIePqgsCh'];

  // PATCH25 FIX: Demographic object for API server processing
  // The API server will convert these demographic arrays to Firebase tag IDs
  var demographicObj = {
    industry: industryTags,
    age: allAgeOptions, // Default to ALL ages if empty
    genderSexualPreference: allGenderOptions, // Default to ALL genders if empty
    ethnicity: allEthnicityOptions, // Default to ALL ethnicities if empty
    disability: allDisabilityOptions, // Default to ALL disabilities if empty
    lowerSocioEconomicBackground: allSocioEconomicOptions // Default to ALL backgrounds if empty
  };

  return {
    id: id(data.id),
    opportunityType: str(data.opportunityType) || 'opportunity',
    title: str(data.title),
    status: str(data.status) || 'live',
    demographic: demographicObj,
    tags: {
      tags: tagsArr,
      demographic: {
        age: '',
        genderSexualPreference: '',
        ethnicity: '',
        disability: '',
        lowerSocioEconomicBackground: '',
        keywords: keywordsArr
      }
    }
  };
}

// Test the normalization function
const testData = {
  id: 'test-normalization-' + Date.now(),
  opportunityType: 'Apprenticeship',
  title: 'Test Normalization Function',
  tags: {
    industry: ['Technology'],
    keywords: ['apprentice', 'coding'] // NO demographic keywords = default to ALL
  }
};

console.log('🧪 Testing Google Apps Script Normalization Function...');
console.log('📤 Input data:', JSON.stringify(testData, null, 2));

const normalized = normalizeOpportunityData(testData);
console.log('📋 Normalized data:', JSON.stringify(normalized, null, 2));

console.log('\n🔍 Demographic arrays:');
console.log('Ages:', normalized.demographic.age);
console.log('Genders:', normalized.demographic.genderSexualPreference);
console.log('Ethnicities:', normalized.demographic.ethnicity);
console.log('Disabilities:', normalized.demographic.disability);
console.log('Socio-economic:', normalized.demographic.lowerSocioEconomicBackground);

console.log('\n📊 Expected API server processing:');
console.log('Total demographic values to convert to tag IDs:', 
  normalized.demographic.age.length + 
  normalized.demographic.genderSexualPreference.length + 
  normalized.demographic.ethnicity.length + 
  normalized.demographic.disability.length + 
  normalized.demographic.lowerSocioEconomicBackground.length
);
