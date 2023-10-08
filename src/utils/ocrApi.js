// api.js
let apiEndpoint;

if (process.env.LOCAL_OCR_API_HOST) {
  apiEndpoint = process.env.LOCAL_OCR_API_HOST;
} else {
  apiEndpoint = '' 
}

export { apiEndpoint };
