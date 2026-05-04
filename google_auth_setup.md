# Google Authentication Setup Guide

To show your **actual Gmail accounts** when clicking "Continue with Google", you need to connect your website to a real Firebase Project. Follow these simple steps:

### 1. Create a Firebase Project
*   Go to the [Firebase Console](https://console.firebase.google.com/).
*   Click **"Add project"** and give it a name (e.g., "CareerForge AI").
*   Follow the prompts to finish creating the project.

### 2. Enable Google Sign-In
*   In the Firebase sidebar, go to **Build > Authentication**.
*   Click **"Get Started"**, then go to the **Sign-in method** tab.
*   Click **"Add new provider"** and select **Google**.
*   Enable it, choose your support email, and click **Save**.

### 3. Get Your Configuration Keys
*   Go to **Project Settings** (the gear icon next to "Project Overview").
*   Under the **General** tab, scroll down to "Your apps".
*   Click the **Web** icon (`</>`) to register your app.
*   Copy the `firebaseConfig` object. It will look like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef..."
    };
    ```

### 4. Enable Google Identity Services (For the Account List)
To show the **"Choose an account"** list with your real Gmail accounts (as seen in your screenshot):
*   In the Google Cloud Console (linked to your Firebase project), go to **APIs & Services > Credentials**.
*   Look for **"OAuth 2.0 Client IDs"**.
*   Find the **"Web client"** ID. It looks like: `123456789-abc...googleusercontent.com`.
*   Copy this **Client ID** and paste it into the `GOOGLE_CLIENT_ID` field in `login.html`.

### 5. Authorized JavaScript Origins
*   Very Important: In the same "Web client" settings in Google Cloud Console, add your website URL (e.g., `http://localhost:5501` or `http://127.0.0.1:5501`) to the **"Authorized JavaScript origins"** and **"Authorized redirect URIs"** sections.
*   If this is not done, Google will block the account list for security.

### 6. Update Your Code
*   Open `login.html`.
*   Paste your **API Key** into `firebaseConfig`.
*   Paste your **Client ID** into the `GOOGLE_CLIENT_ID` variable at the top of the script.

> [!TIP]
> If you are testing locally (e.g., via VS Code Live Server), make sure `127.0.0.1` and `localhost` are both in the "Authorized domains" list in Firebase.
