// Quick test to verify exact text values the portal expects
function testPortalExactValues() {
  console.log('Testing exact portal values...');
  
  // Based on your HTML examples, test these exact values:
  const testData = {
    id: 'portal-exact-values-test-' + Date.now(),
    opportunityType: 'Apprenticeship',
    title: 'Portal Exact Values Test - Manual Text Matching',
    shortSummary: 'Testing exact text values that portal UI expects.',
    location: 'Manchester, UK',
    applicationDeadline: '2025-12-31T23:59:59Z',
    link: 'https://example.com/portal-exact-values-test',
    salary: '£22,000 per year',
    lengthOfApprenticeship: '18 months',
    levelOfApprenticeship: 'Level 4',
    status: 'live',
    anythingElseImportant: 'EXACT VALUES TEST: Using exact text from portal HTML structure',
    demographic: {
      industry: ['Technology'],
      age: ['Over 18'],
      genderSexualPreference: ['He/Him'], 
      ethnicity: ['Asian or Asian British'],
      disability: ['Neurodiversity'], // Exact text from your HTML
      lowerSocioEconomicBackground: ['All backgrounds'] // Exact text from your HTML
    }
  };
  
  return testData;
}
