// api.js
let apiEndpoint;

if (process.env.NEXT_PUBLIC_OCR_API_HOST) {
  apiEndpoint = process.env.NEXT_PUBLIC_OCR_API_HOST;
} else {
  apiEndpoint = '' 
}

export { apiEndpoint };
