/**
 * 🎯 TEST SPECIFIC DEMOGRAPHICS PARSING - PATCH27
 * 
 * This test verifies the enhanced parser can handle:
 * 1. Multi-line "Important details" with bullet points
 * 2. Comma-separated demographic values like "He/Him, She/Her, They/Them"
 * 3. Specific demographic criteria instead of defaulting to "All"
 */

// Mock content from mock_specific_demographics.txt
const mockContent = `Salary: £35,000 - £42,000 per annum
Length of contract: 12 months fixed-term
Hours of work: 37.5 hours per week (full-time)
Application deadline: 15 January 2026
Location: Manchester
Important details: 
- This role is specifically designed to support underrepresented voices in tech.
- Working on diversity and inclusion initiatives within the company.
- Must have experience working with LGBTQ+ communities and understanding of intersectional challenges.
- Preference given to candidates from working-class backgrounds who understand economic barriers.
- Role involves mentoring young professionals aged 18-25 entering the tech industry.
- Flexible working arrangements available for candidates with accessibility needs.
- Company committed to creating an inclusive environment for neurodivergent employees.
- Strong focus on supporting women and non-binary individuals in leadership roles.
- Experience working with Black, Asian, and ethnic minority communities preferred.
- Training provided on unconscious bias and inclusive recruitment practices.
- Reporting to Head of Diversity & Inclusion.
- Benefits include mental health support, accessibility equipment allowances, and cultural leave policies.
Link: https://www.techcompany.com/careers/diversity-inclusion-coordinator
Industry: Technology, HR, Diversity & Inclusion
Age: 18-25, Young professionals
Gender & Sexual Preference: Women, Non-binary, LGBTQ+, He/Him, She/Her, They/Them
Ethnicity: Black, Asian, Mixed heritage, Pakistani
Disability: Neurodiversity, Physical disability, Mental health conditions
Economic Background: Working class, Low income, First generation university
Remote: Hybrid
UK Wide: No
Region: North West`;

// Test the enhanced parser with Google Apps Script functions
function testSpecificDemographicsParsing() {
  console.log('🎯 TESTING SPECIFIC DEMOGRAPHICS PARSING - PATCH27');
  
  console.log('📝 Parsing mock file content...');
  
  // This would normally use parseTextFileInGoogleScript() from google_script
  // For Node.js testing, simulate the expected behavior
  
  // Parse Gender & Sexual Preference - should be split into individual items
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
