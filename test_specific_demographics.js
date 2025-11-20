// Test specific demographic parsing
// Simulate the mock document content

const mockContent = `Event Title: Test Arts Residency
Event Description: A residency program for emerging artists
Application Deadline: December 6th, 2025
Industry Tags: Arts, Creative Industries
Gender & Sexual Preference: Women, Non-binary, LGBTQ+, He/Him, She/Her, They/Them
Age: 18-25, Over 18
Ethnicity: BAME, Black, Asian
Disability: Neurodiversity, All disability
Economic Background: Working class, Low income`;

// Simulate parsing the demographic fields
function testDemographicParsing() {
  const keywords = [];
  
  // Parse Gender & Sexual Preference
  const genderValue = "Women, Non-binary, LGBTQ+, He/Him, She/Her, They/Them";
  if (genderValue && genderValue.trim()) {
    const genderValues = genderValue.split(',').map(item => item.trim());
    keywords.push(...genderValues);
    console.log('🔍 Added gender values:', genderValues);
  }
  
  // Parse Age
  const ageValue = "18-25, Over 18";
  if (ageValue && ageValue.trim()) {
    const ageValues = ageValue.split(',').map(item => item.trim());
    keywords.push(...ageValues);
    console.log('🔍 Added age values:', ageValues);
  }
  
  // Parse Ethnicity
  const ethnicityValue = "BAME, Black, Asian";
  if (ethnicityValue && ethnicityValue.trim()) {
    const ethnicityValues = ethnicityValue.split(',').map(item => item.trim());
    keywords.push(...ethnicityValues);
    console.log('🔍 Added ethnicity values:', ethnicityValues);
  }
  
  // Parse Disability
  const disabilityValue = "Neurodiversity, All disability";
  if (disabilityValue && disabilityValue.trim()) {
    const disabilityValues = disabilityValue.split(',').map(item => item.trim());
    keywords.push(...disabilityValues);
    console.log('🔍 Added disability values:', disabilityValues);
  }
  
  // Parse Economic Background
  const economicValue = "Working class, Low income";
  if (economicValue && economicValue.trim()) {
    const economicValues = economicValue.split(',').map(item => item.trim());
    keywords.push(...economicValues);
    console.log('🔍 Added economic values:', economicValues);
  }
  
  console.log('\n🎯 Final keywords array:', keywords);
  console.log('✅ Individual values extracted instead of treating as single strings');
  
  return keywords;
}

testDemographicParsing();
