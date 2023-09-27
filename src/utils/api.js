// api.js
let apiEndpoint;

if (process.env.LOCAL_API_HOST) {
  apiEndpoint = process.env.LOCAL_API_HOST;
} else {
  apiEndpoint = process.env.NEXT_PUBLIC_API_HOST;
}

export { apiEndpoint };
