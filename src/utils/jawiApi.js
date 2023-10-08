 // api.js
let apiEndpoint;

if (process.env.LOCAL_JAWI_API_HOST) {
  apiEndpoint = process.env.LOCAL_JAWI_API_HOST ;
} else {
  apiEndpoint = '' 
}

export { apiEndpoint };
