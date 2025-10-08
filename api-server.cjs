const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const { join } = require('path');

console.log('Script start');

// Configuration
const config = {
  port: process.env.PORT || 8080,
  firebaseProjectUrl: process.env.FIREBASE_DATABASE_URL || 'https://eric-staging-portal.firebaseio.com',
  serviceAccountPath: process.env.SERVICE_ACCOUNT_PATH || 'serviceAccountKey.json'
};

try {
  const serviceAccountPath = join(process.cwd(), config.serviceAccountPath);
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
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
  const now = new Date();
  
  const commonData = {
    // Core content fields
    title: data.title,
    description: data.shortSummary,
    anythingElseImportant: data.anythingElseImportant ?? '',
    link: data.link ?? '',
    
    // Firebase required fields that match the schema
    id: data.id,
    type: 'announcements',
    category: data.opportunityType?.toLowerCase() ?? 'course',
    categoryTitle: data.opportunityType ?? 'Course',
    
    // Metadata fields
    author: 'document-parser-api',
    created: 'document-parser-api',
    editor: 'document-parser-api',
    createdAt: now.toISOString(),
    editedAt: now.toISOString(),
    publishedAt: now.toISOString(),
    
    // Status and verification
    status: 'draft',
    companyVerify: false,
    companyID: 'default-company-id',
    
    // Arrays (initialize empty)
    tags: data.tags?.industry ?? [],
    keywords: data.tags?.keywords ?? [],
    userClaps: [],
    userContentView: [],
    userLinkClick: [],
    usersFavouriteContent: [],
    
    // Timestamps
    schedulePost: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
    applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
    
    // Optional fields
    bannerPic: null,
  };

  switch (data.opportunityType) {
    case 'Apprenticeship':
      return {
        ...commonData,
        salary: data.salary ?? '',
        lengthOfApprenticeship: data.lengthOfApprenticeship ?? '',
        levelOfApprenticeship: data.levelOfApprenticeship ?? '',
      };
    case 'Course':
      return {
        ...commonData,
        lengthOfCourse: data.lengthOfCourse ?? '',
        paidOrFreeCourses: data.courseType ?? 'free',
        courseLocation: data.location ?? '',
      };
    default:
      return {
        ...commonData,
      };
  }
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

    // 2. Save to master portal's Firebase
    const collectionPath = `announcements/${opportunityData.opportunityType}/list`;
    const docRef = await db.collection(collectionPath).add(transformedData);
    
    console.log(`✅ Successfully saved to master portal: ${collectionPath}/${docRef.id}`);
    console.log('Transformed data:', transformedData);

    res.status(200).json({
      message: 'Data received and processed successfully.',
      masterPortalDocId: docRef.id,
      collectionPath: collectionPath,
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
