import { msalInstance } from "@/utils/authConfig";
import { Client } from "@microsoft/microsoft-graph-client";

export const getCalendarEvents = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error("User is not logged in");
  }

  const accessToken = await msalInstance.acquireTokenSilent({
    scopes: ["Calendars.Read"],
    account: accounts[0], // Use the first account
  });
  console.log({accessToken})
  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    },
  });

  const events = await client.api("/me/events").get();
  return events.value;
};