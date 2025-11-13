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
  "All backgrounds": "20fXkU9RdlTlpfcS5K5D",
  "Only those from lower socio-economic background": "V9J6aDjeQc7hIePqgsCh",
  "Have or had free school meals": "KTZ2FRZNDwQImteZFmjG",

  // Communities/Disability (PATCH27: Fixed with correct CSV mappings)
  "Physical disability": "09Q2FEVzWlOBc5AqoypO", // From CSV: communities section
  "Neurodiversity": "Yk6phdz0yBMP0c0rULDx", // From CSV: equality section (most specific)
  "Chronic illness": "S6BVkq9Z9rSfeAs1rR78", // From CSV: communities section
  "Hearing impairment": "09Q2FEVzWlOBc5AqoypO", // Using Physical disability ID - no specific ID in CSV
  "Visual impairment": "Yk6phdz0yBMP0c0rULDx", // Using Neurodiversity ID - no specific ID in CSV
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
  "Physical disability": "YI6XgFxHn8x4LYzkHkIM", // From equality section
  "Neurodiversity": "Yk6phdz0yBMP0c0rULDx", // From equality section
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

    // Try exact and normalized matches
    if (TAG_NAME_TO_ID.hasOwnProperty(stripped)) return TAG_NAME_TO_ID[stripped];
    for (const k of Object.keys(TAG_NAME_TO_ID)) {
      if (normalizeKey(k) === key) return TAG_NAME_TO_ID[k];
    }
    return null;
  }
  
  let allTags = new Set();

  // Helper to add a tag if it resolves to a valid ID
  function addTag(tag) {
    if (typeof tag === 'string') {
      const tagId = getTagCode(tag);
      if (tagId) {
        allTags.add(tagId);
      }
    }
  }

  // Process industry tags
  if (data.demographic && Array.isArray(data.demographic.industry)) {
    data.demographic.industry.forEach(addTag);
  }

  // Process demographic fields (PATCH25: Handle arrays of demographic values)
  const demo = (data.tags && data.tags.demographic) ? data.tags.demographic : (data.demographic || {});
  const demographicFields = ['age', 'genderSexualPreference', 'ethnicity', 'disability', 'lowerSocioEconomicBackground'];
  demographicFields.forEach(field => {
    if (demo[field]) {
      if (Array.isArray(demo[field])) {
        // Handle array of demographic values
        demo[field].forEach(addTag);
      } else {
        // Handle single demographic value
        addTag(demo[field]);
      }
    }
  });

  // Process any additional tags
  if (Array.isArray(data.tags)) {
    data.tags.forEach(addTag);
  } else if (data.tags && typeof data.tags === 'object' && Array.isArray(data.tags.tags)) {
    data.tags.tags.forEach(addTag);
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
 */
app.post('/opportunities', async (req, res) => {
  try {
    const opportunityData = req.body;
    console.log('Received opportunity data:', {
      id: opportunityData.id,
      type: opportunityData.opportunityType,
      title: opportunityData.title
    });

    // 1. Transform the data
    const transformedData = transformData(opportunityData);

    // 2. Save to master portal's Firebase using configured collection path
    const [collection, subcollection, listCollection] = config.targetCollectionPath.split('/');
    
    // Always use Firebase auto-generated ID
    const docRef = await db.collection(collection).doc(subcollection).collection(listCollection).add(transformedData);
    
    // Update the ID in the document with Firebase's auto-generated ID
    const generatedId = docRef.id;
    transformedData.id = generatedId;
    await docRef.update({ id: generatedId });

    console.log(`✅ Successfully saved to master portal: ${config.targetCollectionPath}/${generatedId}`);
    console.log('Transformed data:', transformedData);

    res.status(200).json({
      message: 'Data received and processed successfully.',
      masterPortalDocId: generatedId,
      collectionPath: config.targetCollectionPath,
      data: transformedData,
    });
  } catch (error) {
    console.error('❌ Error processing opportunity:', error);
    res.status(500).json({
      error: 'Error processing request.',
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
