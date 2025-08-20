import axios from 'axios';
import config from '../Pages/config';
import { ApiResponse } from '../find/types';

export async function fetchFindData(filters: any): Promise<ApiResponse> {
    // Log the filters being applied
    console.log("Filters applied:", filters);
    
    // Build the query string from filters
    const query = new URLSearchParams(filters).toString();
    const url = `${config.API_BASE_URL}/api/find-data/get?${query}`;
  
    // Log the full API URL
    console.log("Making API request to:", url);
  
    try {
      // Make the API request
      const { data } = await axios.get<ApiResponse>(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
  
      // Log the response data
      console.log("API Response Data:", data);
      
      return data;
    } catch (error) {
      // Log any errors encountered during the API call
      console.error("API request failed:", error);
      throw error;
    }
  }