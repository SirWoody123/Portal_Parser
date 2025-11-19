// Tag name to unique ID mapping for tags - PATCH26 Updated from Tags987.csv
const TAG_NAME_TO_ID = {
  // --- DEMOGRAPHICS ---
  // Ages (from CSV)
  "16 and under": "Yfxp8QQJtghr4qQPmkx8",
  "16": "PSPwCv5pAPk9kgHAXlbY",
  "17": "yYpBd3kiH0UhUJtM0Ymf",
  "18": "TYaWbgKh8ai492LRdp3n",
  "19": "5PSzhQ2e4SC6YgC9Tq19",
  "20": "VHmROHGeI7eM4D0xFT1H",
  "21": "3RFE8LOp5gmRFKBnq3Y7",
  "22": "Wk1k8kt8tZlALiVeW0Qq",
  "23": "SjDtv9VjoKmpzKZvfXzp",
  "24": "PIAq1kX4RW63lJ4jYZn0",
  "25": "ypAb8alCEnbvDlS5ZqLu",
  "Under 18": "cb70qB5JuW1SeTK7WmbY",
  "Over 18": "6Bj2Xtzi0uIWc8ZrTVtY",
  "Over 25": "sS3aP11L68igBoD7f0xe",

  // Socioeconomic (from CSV)
  "All backgrounds": "bPayOs0b1R9a2jXC9Fkt", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Only those from lower socio-economic background": "5Z0Z1vg34KYVGFdwSrIz", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Have or had free school meals": "KTZ2FRZNDwQImteZFmjG",

  // Communities/Disability (PATCH28C: ALL related tag IDs for each concept)
  "Physical disability": "lFeNbarY7S9XYdQUS79F", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Neurodiversity": "rT4QGqejDAONg3PmA9Il", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Hearing impairment": "uLUtXEJ1od2dZrkmMGID", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Chronic illness": "S6BVkq9Z9rSfeAs1rR78", // From CSV: communities section
  "Visual impairment": "t5BMlv7HEf09bHK5a9N0", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "LGBTQIA+": "92OxqHPOwpUDI765t62h",
  "Mental health": "wxvBjYt6r8aXPo51j0nI", // Fixed: correct CSV mapping
  "Carer": "EnzIhbSJi60VWwmFjq6F",

  // Pronouns/Gender (from CSV)
  "ForThem": "2Dhp3LeTBZqgTedOOPMT",
  "He/Him": "BGHOxtT7mL635uaWX7Wd",
  "They/Them": "D8TZCPwER6lzJV3p1fmA",
  "She/Her": "Ljk28RD3LQJHXb1OXzz7",
  "Non-binary": "D8TZCPwER6lzJV3p1fmA", // Using They/Them ID
  "Transgender": "D8TZCPwER6lzJV3p1fmA", // Using They/Them ID
  "Intersex": "D8TZCPwER6lzJV3p1fmA", // Using They/Them ID
  "Other": "JNNkRh7GpLhmtNLhIBRZ", // Other ethnicity ID
  "Prefer not to say": "WMLPtNRCGSBbv7bViz1S", // Using Race ID

  // Experience (from CSV)
  "Someone looking to get work": "8oVouULyPluxVdnb1DJD",
  "Someone looking to explore": "Qjqkw3S9M7fyo4sE44kI",
  "Someone looking to upskill": "iqtWnDQCz1nldxBiLCXy",

  // --- ETHNICITY (Fixed from CSV) ---
  "Mixed": "7NFcbDXSsKW4OJJboIN8",
  "Mixed or Multiple Ethnic group": "dtHf8HC9oZbwuuykzRrE", // Fixed: correct CSV mapping
  "Other": "JNNkRh7GpLhmtNLhIBRZ",
  "Other Ethnic Group": "ZBpKSjEz0oGXA7Ju6Rh1", // Fixed: correct CSV mapping
  "White": "Tfsft2clh6NQfBzBwVRm",
  "White or White British": "OzWIBHiSh2UmWvQAQpFd", // Fixed: correct CSV mapping
  "Asian": "ZqmWly9vdEbaBk1fXker",
  "Asian or Asian British": "RRPIGD8goCRgLEiCoTsi", // Fixed: correct CSV mapping
  "Black": "igXCnhhokWdi5FvqiDha",
  "African, Caribbean or Black British": "DUK2DyQTTnvJXp83Cuuw", // Fixed: correct CSV mapping
  "Arab": "uoo9FHEqHrUFVGSc2McX", // Fixed: correct CSV mapping from ethnicity section
  "Prefer not to say": "WMLPtNRCGSBbv7bViz1S", // Using Race ID

  // --- INDUSTRIES (from CSV) ---
  "All creative industries": "IG7yzsOdsZcE1IttKMe8",
  "Advertising": "JcM1sqyxbJeyZsvXislN",
  "Marketing": "7zcvW4rUaiE9OCqGAf8f",
  "PR": "TwbKLH1maPxUpOMgo7av",
  "Arts": "NoUufyQpwT3qGsVQ7eKC",
  "Museum": "B00NlXT3BgZEcteyEBiQ",
  "Craft": "mVeikPlrGkeqUaNB3RUc",
  "Culture": "ieHxxs2T7J0RTWQyDqBJ",
  "Graphic design": "X2dTLDagIIrEBa40pwBL",
  "Design": "d25TFMPGin2nn2HUQ2ZS",
  "UX/UI design": "XDeiUF1tpazrs6j8nJnt",
  "Fashion": "BSAM73pkE5akPm0aAWEi",
  "Film": "TQP5sTYaSao3hzKyHoqX",
  "Directing": "Ar0PFRfo2BizErhHzOB1",
  "TV": "VluuJp7ikBDJvOZkCtMI",
  "Presenting": "eTJVhmAyjFVgLM1xobKQ",
  "Acting": "8EnwP2QmxphKt3xMydIv",
  "Gaming": "gEODfWliFcVDPzPsaURG",
  "Animation": "jtwd6Also1z1gnxf7cCR",
  "Content creation": "ajxlsmbwodNP5FfVPbvf",
  "Digital": "MyNQqi1cxSKxDzTFIUD1",
  "Music": "H9gLcUeM65AkTEjk8IzH",
  "Podcasting": "nHy5ygseyuQtNDUVxn0J",
  "Radio": "VxeP5CwyZNoKYK3hF8eC",
  "Audio": "Uq7j4jOln0DVzS5VQZIl",
  "Social Media": "2Bhal1Eyn4bfN719dFdM", // FIXED: Correct portal ID from working document 7AoSL3MXC7EuxSobSBKS
  "Videography": "GjC6ilPu74QiVYRvRvgg",
  "Publishing": "ybNc8iJxaoo7TjoJyl71",
  "Writing": "OWX5xMlENH8zEqL6ZJzI",
  "Theatre": "CG68CfUNdPkL8nJFzAih",
  "Performing arts": "zxLgYbKNdPL4QwJecnIw",
  "Comedy": "gvTLKWX76UhDquYF9UuL",
  "Dance": "CV02t8BX1lZ1teVZQpdM",
  "Journalism": "ggclbk2GjvOUbFZUH4ym",
  "VFX": "OKucTagUEJ5OSftS6DjH",
  "Architecture": "u6YjM78DnfHgJYoEn6td",
  "Travel": "VS2ca4vwGXaOZ6khfjff",
  "Visual arts": "etbVDUKJ63EHFcPlbn68",
  
  // --- CAREER (from CSV) ---
  "CVs & Portfolios": "Cfm3Qi6fKuYCnkrzNdqz",
  "Money & finance": "Fsupenr6EtZuhFXCUGAY",
  "Advice": "2OKsPtBRoqvFJQEkA9XU",
  "Mentoring": "XYrofvp4aWJUN8q0kqbA",
  "Networking": "Vy6sKZydj6wJIj9DTETW",
  "Portfolio advice": "EZ8pCPYQITDCvtAaLdGg",
  "Side hustle": "FuXsrn6y678PVhrqgTZE",
  "Freelancing": "JeWe9J7Wde0FENhxEcW1",
  "Apprenticeships": "LtF0yJ1Fa99hLPgcrAnm",
  "Industry knowledge": "V6tiLf4jn2zmuvkcxB0P",
  "Internships": "VqsCdV8yAjHIZs46vpgi",
  "Portfolio career": "evEppyXLsrW795Oma9Xj",
  "Online courses": "ZSC7cSm7tgtySwVirSXR",

  // --- EQUALITY & DIVERSITY (from CSV) ---
  "Accessibility": "9Z0KCkg1UndKEeGsGRWF",
  // "Physical disability" - REMOVED DUPLICATE! Already defined above with 3 IDs
  // "Neurodiversity" - REMOVED DUPLICATE! Already defined above with correct portal ID
  "Race": "WMLPtNRCGSBbv7bViz1S",
  "LGBTQIA": "mzZKi6mwaVEwTeNkpAjb",
  "Gender": "o4rMfwsP8UOAjvGwRhgP",
  "Disability": "sehUuVOIEKmsYNpQROHe",

  // --- WORK LIFE (from CSV) ---
  "Remote working": "buypYIgcB5e4FrJOKEA3",
  "Travel opportunities": "bs5frssJMw54bToCeDE4",
  "Maternity/paternity leave": "ojcmlhTMc5vT0mK4OBYn",
  "Flexible working": "rHFYF9GgaJpJrkMLO3RD",

  // --- TRAINING (from CSV) ---
  "Unconscious bias": "9Q2h3tBc2SY9R0Rrppfw",
  "Onboarding": "JkrVJTsFOxAaDeL6kusP",
  "Team building": "NweAZ9RUw5ECa0XvkKoF",
  "Soft skills": "RR2f9ImEpBsVoBniqDHb",
  "Technical skills": "gBPvSXXYUJ71l28c3GJ1",

  // --- PERKS (from CSV) ---
  "Unlimited holidays": "7P5Hf8CqYKW9Nh1RY5f8",
  "Branded merch": "IcM5f4EXFDZnfoeHn1HQ",
  "Work phone": "LtkTKVFdDOG3JGM7yAR9",
  "Discounts": "Vc9PVatz7TM4XbeMS2as",
  "Office parties": "nNAgMvJrxvFx9iCTIYpP",
  "Bonuses": "szqvbHXC1odr53r7dJAJ",
  "Dog friendly": "uI94cFJLSkuZvL06vsl6",
  "Healthcare": "xkAmPOEAk8244rXIXpdb",
  "Free breakfast": "bu1QkOIorG4fjYpxhc5e"
};
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const { join } = require('path');

console.log('Script start');

// Configuration
const config = {
  port: process.env.PORT || 8080,
  firebaseProjectUrl: process.env.FIREBASE_DATABASE_URL || 'https://eric-dev-c6144.firebaseio.com',
  serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json',
  targetCollectionPath: process.env.MASTER_COLLECTION_PATH || 'announcements/announcements/list'
};


// Build service account object from environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseProjectUrl,
  });
  console.log(`Firebase initialized with project: ${config.firebaseProjectUrl}`);
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' })); // Support text input

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
        // Extract a meaningful title from the description
        if (!result.title && value) {
          // Look for company/role patterns in the text
          const companyMatch = value.match(/positions? at ([^®\.]+)/i);
          const roleMatch = value.match(/(Design|Developer|Engineer|Manager|Intern|Graduate|Apprentice)[^\.]*positions?/i);
          
          if (companyMatch) {
            const company = companyMatch[1].trim();
            const industry = result.demographic?.industry?.[0] || 'Role';
            result.title = `${industry} Opportunity at ${company}`;
          } else if (roleMatch) {
            result.title = roleMatch[0].trim();
          } else {
            // Fallback to first meaningful sentence
            const sentences = value.split('.');
            let titleSentence = sentences.find(s => 
              s.length > 20 && s.length < 100 && 
              !s.toLowerCase().includes('this opportunity')
            );
            
            if (titleSentence) {
              result.title = titleSentence.trim();
            } else {
              result.title = value.substring(0, 60) + '...';
            }
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

/**
 * Transforms data from the standalone parser format to the master portal format.
 * @param {Object} data The data from the standalone parser.
 * @returns {Object} The transformed data for the master portal.
 */
const transformData = (data) => {
  // Always use this companyID and created value
  const fixedCompanyID = 'S7IvlojyomcTNsUXlrqC';
  
  // --- TAGS LOGIC ---
  function normalizeKey(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[\s\u00A0]+/g, ' ')
      .replace(/["'`]/g, '')
      .replace(/[&]/g, 'and');
  }

  function looksLikeId(s) {
    if (!s) return false;
    const t = String(s).trim();
    // Firestore IDs are typically 20+ chars alphanumeric with -_ sometimes
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

    // Try exact and normalized matches (PATCH28C: Handle array values)
    if (TAG_NAME_TO_ID.hasOwnProperty(stripped)) {
      const result = TAG_NAME_TO_ID[stripped];
      return Array.isArray(result) ? result : result; // Return as-is (could be string or array)
    }
    for (const k of Object.keys(TAG_NAME_TO_ID)) {
      if (normalizeKey(k) === key) {
        const result = TAG_NAME_TO_ID[k];
        return Array.isArray(result) ? result : result; // Return as-is (could be string or array)
      }
    }
    return null;
  }
  
  let allTags = new Set();

  // Helper to add a tag if it resolves to a valid ID (PATCH25: Enhanced debugging + Handle multiple IDs)
  function addTag(tag) {
    if (typeof tag === 'string') {
      console.log(`🔍 PATCH25 DEBUG: Processing tag "${tag}"`);
      const tagResult = getTagCode(tag);
      console.log(`🔍 PATCH25 DEBUG: getTagCode("${tag}") returned:`, tagResult);
      
      if (tagResult) {
        if (Array.isArray(tagResult)) {
          // Add all IDs if it's an array (e.g., Physical disability has 3 IDs)
          console.log(`✅ PATCH25 DEBUG: Adding ${tagResult.length} IDs for "${tag}":`, tagResult);
          tagResult.forEach(id => allTags.add(id));
        } else {
          // Add single ID
          console.log(`✅ PATCH25 DEBUG: Adding single ID for "${tag}":`, tagResult);
          allTags.add(tagResult);
        }
      } else {
        console.log(`❌ PATCH25 DEBUG: No tag ID found for "${tag}"`);
      }
    } else {
      console.log(`⚠️ PATCH25 DEBUG: Skipping non-string tag:`, tag);
    }
  }

  // Process industry tags
  if (data.demographic && Array.isArray(data.demographic.industry)) {
    data.demographic.industry.forEach(addTag);
  }

  // Process demographic fields (PATCH26: Fixed demographic processing)
  const demo = data.demographic || {};
  console.log('🔍 PATCH26 DEBUG: Processing demographic data:', JSON.stringify(demo, null, 2));
  
  const demographicFields = ['age', 'genderSexualPreference', 'ethnicity', 'disability', 'lowerSocioEconomicBackground'];
  demographicFields.forEach(field => {
    if (demo[field]) {
      console.log(`🔍 PATCH26 DEBUG: Processing ${field}:`, demo[field]);
      if (Array.isArray(demo[field])) {
        // Handle array of demographic values
        demo[field].forEach(value => {
          console.log(`🔍 PATCH26 DEBUG: Processing demographic value "${value}" from ${field}`);
          addTag(value);
        });
      } else {
        // Handle single demographic value
        console.log(`🔍 PATCH26 DEBUG: Processing single demographic value "${demo[field]}" from ${field}`);
        addTag(demo[field]);
      }
    }
  });

  // Process any additional tags (PATCH25: Enhanced debugging)
  console.log('🔍 PATCH25 DEBUG: Processing tags. data.tags structure:', JSON.stringify(data.tags, null, 2));
  
  if (Array.isArray(data.tags)) {
    console.log('🔍 PATCH25 DEBUG: Processing data.tags as array:', data.tags);
    data.tags.forEach(addTag);
  } else if (data.tags && typeof data.tags === 'object' && Array.isArray(data.tags.tags)) {
    console.log('🔍 PATCH25 DEBUG: Processing data.tags.tags as array:', data.tags.tags);
    data.tags.tags.forEach(addTag);
  } else {
    console.log('❌ PATCH25 DEBUG: No valid tags array found');
  }

  // Convert Set to Array
  const tags = Array.from(allTags);

  // Get the source demographic data
  const sourceDemographic = data.tags?.demographic || {};
  
  // PATCH27 FIX: Portal needs BOTH tags array AND demographic object
  // Tags array: for hashtag section
  // Demographic object: for demographic sections (Age, Gender, Ethnicity, Disability, Socio-Economic)
  
  // Build demographic object with text values for portal UI
  function buildDemographicObject(demographicData) {
    console.log('🔍 PATCH26 DEBUG: Building demographic object from:', JSON.stringify(demographicData, null, 2));
    
    const result = {
      industry: [],
      age: [],
      genderSexualPreference: [],
      ethnicity: [],
      disability: [],
      lowerSocioEconomicBackground: []
    };
    
    if (demographicData && typeof demographicData === 'object') {
      // Map arrays to text values for portal display
      if (Array.isArray(demographicData.age)) {
        result.age = demographicData.age;
      }
      if (Array.isArray(demographicData.genderSexualPreference)) {
        result.genderSexualPreference = demographicData.genderSexualPreference;
      }
      if (Array.isArray(demographicData.ethnicity)) {
        result.ethnicity = demographicData.ethnicity;
      }
      if (Array.isArray(demographicData.disability)) {
        result.disability = demographicData.disability;
      }
      if (Array.isArray(demographicData.lowerSocioEconomicBackground)) {
        result.lowerSocioEconomicBackground = demographicData.lowerSocioEconomicBackground;
      }
      if (Array.isArray(demographicData.industry)) {
        result.industry = demographicData.industry;
      }
    }
    
    console.log('🔍 PATCH26 DEBUG: Built demographic object result:', JSON.stringify(result, null, 2));
    return result;
  }

  return {
    // Required fields from actual portal format
    anythingElseImportant: data.anythingElseImportant ?? '',
    applicationDeadline: data.applicationDeadline || '',
    author: data.author || '',
    bannerPic: data.bannerPic || '',
    category: data.category || '',
    categoryTitle: data.categoryTitle || '',
    opportunityType: data.opportunityType || '',
    companyID: fixedCompanyID,
    companyVerify: data.companyVerify ?? true,
    courseLocation: data.courseLocation || '',
    created: fixedCompanyID,
    createdAt: data.createdAt || '',
    description: data.description || '',
    editedAt: data.editedAt || '',
    editor: data.editor || 'scheduler',
    id: data.id || '',
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    lengthOfCourse: data.lengthOfCourse || '',
    link: data.link || '',
    paidOrFreeCourses: data.paidOrFreeCourses || '',
    publishedAt: data.publishedAt || '',
    schedulePost: data.schedulePost || '',
    status: data.status || 'expired',
    tags: tags,
    title: data.title || '',
    type: data.type || 'announcements',
    userClaps: Array.isArray(data.userClaps) ? data.userClaps : [],
    userContentView: Array.isArray(data.userContentView) ? data.userContentView : [],
    // Optional/extra fields for compatibility
    approvalFirst: data.approvalFirst ?? false,
    bespokeOnly: data.bespokeOnly ?? false,
    eventDate: data.eventDate || '',
    eventName: data.eventName || '',
    eventTime: data.eventTime || '',
    eventTimeEnd: data.eventTimeEnd || '',
    expiredDate: data.expiredDate || '',
    location: data.location || '',
    locationName: data.locationName || '',
    notificated: data.notificated ?? false,
    regionLocation: data.regionLocation ?? null,
    remote: data.remote ?? false,
    republish: data.republish ?? false,
    supportSettings: Array.isArray(data.supportSettings) ? data.supportSettings : [],
    ukWide: data.ukWide ?? false,
    userLinkClick: Array.isArray(data.userLinkClick) ? data.userLinkClick : [],
    usersFavouriteContent: Array.isArray(data.usersFavouriteContent) ? data.usersFavouriteContent : [],
    
    // PATCH27 FIX: Add demographic object for portal UI demographic sections
    demographic: buildDemographicObject(data.demographic)
  };
};

/**
 * Endpoint to receive opportunity data from the standalone parser.
 * Supports both JSON and text file formats.
 */
app.post('/opportunities', async (req, res) => {
  try {
    let opportunityData;
    
    // Detect input format and parse accordingly
    const contentType = req.get('content-type') || '';
    console.log('🔍 INPUT DETECTION: Content-Type:', contentType);
    console.log('🔍 INPUT DETECTION: Body type:', typeof req.body);
    
    if (contentType.includes('text/plain') || typeof req.body === 'string') {
      // Handle text file input
      console.log('🔍 INPUT DETECTION: Processing as text file');
      const textContent = req.body;
      console.log('🔍 INPUT DETECTION: Text content length:', textContent.length);
      opportunityData = parseTextFile(textContent);
    } else if (typeof req.body === 'object' && req.body !== null) {
      // Handle JSON input (existing behavior)
      console.log('🔍 INPUT DETECTION: Processing as JSON');
      opportunityData = req.body;
    } else {
      // Try to auto-detect format based on content
      const bodyStr = String(req.body);
      if (bodyStr.includes(':') && bodyStr.includes('\n')) {
        console.log('🔍 INPUT DETECTION: Auto-detected as text format');
        opportunityData = parseTextFile(bodyStr);
      } else {
        console.log('🔍 INPUT DETECTION: Processing as JSON (fallback)');
        opportunityData = req.body;
      }
    }
    
    console.log('Processed opportunity data:', {
      id: opportunityData.id,
      type: opportunityData.opportunityType,
      title: opportunityData.title,
      hasDescription: !!opportunityData.description,
      hasLink: !!opportunityData.link,
      hasDemographics: !!opportunityData.demographic
    });

    // 1. Transform the data
    const transformedData = transformData(opportunityData);

    // 2. Save to master portal's Firebase using configured collection path
    const [collection, subcollection, listCollection] = config.targetCollectionPath.split('/');
    
    console.log(`🔥 PATCH28: Attempting Firebase write to ${collection}/${subcollection}/${listCollection}`);
    console.log('🔥 PATCH28: Firebase credentials check:', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROJECT_ID?.substring(0, 10) + '...'
    });
    
    // Always use Firebase auto-generated ID
    console.log('🔥 PATCH28: Calling db.collection().add()...');
    const docRef = await db.collection(collection).doc(subcollection).collection(listCollection).add(transformedData);
    console.log('🔥 PATCH28: Firebase add() successful, doc ID:', docRef.id);
    
    // Update the ID in the document with Firebase's auto-generated ID
    const generatedId = docRef.id;
    transformedData.id = generatedId;
    console.log('🔥 PATCH28: Calling docRef.update()...');
    await docRef.update({ id: generatedId });
    console.log('🔥 PATCH28: Firebase update() successful');

    console.log(`✅ Successfully saved to master portal: ${config.targetCollectionPath}/${generatedId}`);
    console.log('Transformed data:', transformedData);

    res.status(200).json({
      message: 'Data received and processed successfully.',
      masterPortalDocId: generatedId,
      collectionPath: config.targetCollectionPath,
      data: transformedData,
    });
  } catch (error) {
    console.error('❌ PATCH28: Error processing opportunity:', error);
    console.error('❌ PATCH28: Error stack:', error.stack);
    console.error('❌ PATCH28: Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      details: error.details
    });
    res.status(500).json({
      error: 'Error processing request.',
      details: error.message,
      patch28Debug: {
        errorCode: error.code,
        errorName: error.name,
        stackTrace: error.stack?.split('\n').slice(0, 3)
      }
    });
  }
});

// PATCH28: Document verification endpoint
app.get('/opportunities/:docId', async (req, res) => {
  try {
    const docId = req.params.docId;
    const [collection, subcollection, listCollection] = config.targetCollectionPath.split('/');
    
    console.log(`🔍 PATCH28: Attempting to read document ${docId} from ${collection}/${subcollection}/${listCollection}`);
    
    const docRef = db.collection(collection).doc(subcollection).collection(listCollection).doc(docId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      console.log(`✅ PATCH28: Document ${docId} exists!`);
      res.status(200).json({
        exists: true,
        id: docId,
        data: docSnap.data()
      });
    } else {
      console.log(`❌ PATCH28: Document ${docId} does not exist`);
      res.status(404).json({
        exists: false,
        id: docId,
        message: 'Document not found'
      });
    }
  } catch (error) {
    console.error(`❌ PATCH28: Error reading document ${req.params.docId}:`, error);
    res.status(500).json({
      error: 'Error reading document',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: {
      port: config.port,
      firebaseProject: config.firebaseProjectUrl
    }
  });
});

console.log('Starting server...');
app.listen(config.port, () => {
  console.log(`🚀 API Bridge server listening at http://localhost:${config.port}`);
  console.log(`📊 Health check available at http://localhost:${config.port}/health`);
  console.log(`🔗 Master portal Firebase: ${config.firebaseProjectUrl}`);
});
