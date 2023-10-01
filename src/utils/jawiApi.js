 // api.js
let apiEndpoint;

if (process.env.NEXT_PUBLIC_ML_API_HOST) {
  apiEndpoint = process.env.NEXT_PUBLIC_ML_API_HOST ;
} else {
  apiEndpoint = '' 
}

export { apiEndpoint };
