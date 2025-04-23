import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
      clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage", // Persist session in localStorage
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read", "Calendars.Read"], // adjust scopes as needed
  };
  
  // Export msalInstance
export const msalInstance = new PublicClientApplication(msalConfig);