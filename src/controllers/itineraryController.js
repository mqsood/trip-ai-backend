const fs = require('fs');
const axios = require('axios');
const Itinerary = require('../models/Itinerary.js');

const fileToBase64 = (path) => {
  return Buffer.from(fs.readFileSync(path)).toString("base64");
};

const generateItinerary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a travel document or ticket' });
    }

    const filePath = req.file.path;
    const fileMimeType = req.file.mimetype;
    const base64Data = fileToBase64(filePath);

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is missing in .env file' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestHeaders = {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    };

    const extractionPrompt = `
      Analyze this travel document. Extract all key details such as destination city, 
      start date, end date, flight/train numbers, hotel names, and traveler names. 
      Return the output as a clean, structured JSON object only. Do not include markdown code blocks.
    `;

    const extractResponse = await axios.post(
      geminiUrl,
      {
        contents: [{
          parts: [
            { text: extractionPrompt },
            { inlineData: { mimeType: fileMimeType, data: base64Data } }
          ]
        }]
      },
      { headers: requestHeaders, timeout: 60000 }
    );

    const responseText = extractResponse.data.candidates[0].content.parts[0].text;

    let extractedData;
    try {
      extractedData = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    } catch (e) {
      extractedData = { rawText: responseText };
    }

    const itineraryPrompt = `
      Based on these travel details: ${JSON.stringify(extractedData)}.
      Generate a realistic, day-by-day travel itinerary. Include morning, afternoon, 
      and evening activity suggestions for each day. Return the final plan as a structured JSON object with this exact format:
      {
        "days": [
          {
            "day": 1,
            "date": "optional date",
            "morning": "morning activities",
            "afternoon": "afternoon activities",
            "evening": "evening activities"
          }
        ]
      }
    `;

    const itineraryResponse = await axios.post(
      geminiUrl,
      { contents: [{ parts: [{ text: itineraryPrompt }] }] },
      { headers: requestHeaders, timeout: 60000 }
    );

    const itineraryText = itineraryResponse.data.candidates[0].content.parts[0].text;

    let generatedItinerary;
    try {
      generatedItinerary = JSON.parse(itineraryText.replace(/```json|```/g, '').trim());
    } catch (e) {
      generatedItinerary = { plan: itineraryText };
    }

    const newItinerary = await Itinerary.create({
      user: req.user._id,
      documentUrl: filePath,
      extractedData,
      generatedItinerary
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json(newItinerary);

  } catch (error) {
    console.error('Gemini Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Server error during AI processing',
      error: error.response ? error.response.data : error.message
    });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const history = await Itinerary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Naya function add kiya
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateItinerary, getUserHistory, getItineraryById };