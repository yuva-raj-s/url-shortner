import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, '../scripts.env') });
import { nanoid } from "nanoid";
import URL from "./urlmodel";
import { redisClient } from "./redisconfig";

// Get your tiny url
export const shorten_url = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { longUrl } = req.body;
   
    if (!longUrl) {
      console.log('No URL provided');
      return res.status(400).json({ 
        status: false, 
        message: "Please provide the url" 
      });
    }

    console.log('Original URL:', longUrl);

    // Validate URL format
    let formattedUrl = longUrl.trim();
    try {
      // Add http:// if not present
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      console.log('Formatted URL:', formattedUrl);
      
      // More lenient URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(formattedUrl)) {
        console.log('URL pattern test failed for:', formattedUrl);
        throw new Error('Invalid URL format');
      }
    } catch (e) {
      console.log('URL validation failed:', e);
      return res.status(400).json({ 
        status: false, 
        message: `Invalid URL format: ${formattedUrl}. Please enter a valid URL (e.g., google.com or https://example.com)` 
      });
    }

    // Check if URL is accessible
    try {
      console.log('Checking URL accessibility...');
      const response = await axios.head(formattedUrl, { 
        timeout: 5000,
        validateStatus: (status) => status < 500, // Accept any status less than 500
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      console.log('URL accessibility check response:', response.status);
    } catch (e: any) {
      console.log('URL accessibility check failed:', e.message);
      if (e.code === "ENOTFOUND") {
        return res.status(400).json({ 
          status: false, 
          message: `URL is not accessible: ${formattedUrl}` 
        });
      }
      return res.status(400).json({ 
        status: false, 
        message: `Error checking URL: ${e.message}` 
      });
    }

    // Check in redis cache
    let tinyUrlFromCache = await redisClient.get(formattedUrl);
    if (tinyUrlFromCache) {
      console.log("Delivering from cache 🗑️🗑️");
      return res.status(200).json({ 
        status: true,
        shortUrl: `${process.env.BASE_URL}/${tinyUrlFromCache}` 
      });
    }

    // Check in MongoDB
    const existingUrl = await URL.findOne({ longUrl: formattedUrl });
    if (existingUrl) {
      console.log("Delivering value from existing data");
      await redisClient.setex(formattedUrl, 86400, existingUrl.shortId);
      return res.status(200).json({ 
        status: true,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortId}` 
      });
    }

    // Generate a new short ID
    let shortId = nanoid(6);
    const newUrl = new URL({ longUrl: formattedUrl, shortId });
    await newUrl.save();

    // Store in cache
    await redisClient.setex(formattedUrl, 86400, shortId);

    return res.status(200).json({ 
      status: true,
      shortUrl: `${process.env.BASE_URL}/${shortId}` 
    });
  } catch (error) {
    console.error("Error in shorten_url:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

//Redirect to your tiny url
export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    console.log(shortId);
    
    // Check Redis cache first
    const cachedUrl = await redisClient.get(shortId);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    // If not found in Redis, check MongoDB
    const urlEntry = await URL.findOne({ shortId });
    if (!urlEntry) {
      return res.status(404).json({
        status: false,
        message: "URL not found"
      });
    }

    // Cache in Redis
    await redisClient.setex(shortId, 86400, urlEntry.longUrl);

    return res.redirect(urlEntry.longUrl);
  } catch (error) {
    console.error("Error in redirectUrl:", error);
    throw error; // Let the error handling middleware handle it
  }
};