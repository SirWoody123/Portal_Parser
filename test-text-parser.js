// Test script for text file parsing functionality
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

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

/**
 * Test endpoint to receive and parse text file data.
 * Supports both JSON and text file formats.
 */
app.post('/test-parse', async (req, res) => {
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
    
    console.log('✅ SUCCESSFULLY PARSED:', {
      title: opportunityData.title,
      description: !!opportunityData.description,
      link: !!opportunityData.link,
      demographics: Object.keys(opportunityData.demographic || {}).length
    });

    res.status(200).json({
      message: 'Text file parsed successfully!',
      parsed: true,
      data: opportunityData
    });
  } catch (error) {
    console.error('❌ Error parsing text file:', error);
    res.status(500).json({
      error: 'Error parsing text file.',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy - text parser test server',
    timestamp: new Date().toISOString()
  });
});

console.log('Starting text parser test server...');
app.listen(port, () => {
  console.log(`🚀 Text Parser Test server listening at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🧪 Test endpoint: POST http://localhost:${port}/test-parse`);
  console.log(`\nTo test, send a POST request with text content to /test-parse`);
});
