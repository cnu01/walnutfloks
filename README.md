# Voice Analytics Dashboard

This is a frontend dashboard for voice AI observability and analytics. I built this to visually display call analytics like durations, volumes, sentiment trends, latency, and sad-path breakdowns.

### What We Built
The application is a React SPA (built with Vite and TypeScript) that tracks voice agent performance. It pulls data from a mock dataset to render beautifully styled Recharts charts. 

The highlight is that you can edit and save your "Call Duration" preferences directly from the dashboard! When you hit save, those changes are stored in a Supabase Postgres database. Custom chart settings are linked to your email address, allowing you to reload them at any time.

### Why Netlify Functions?
To make this work securely, we are using **Netlify Serverless Functions** as the backend API. 

Initially, I could have just made the `fetch` calls to Supabase directly from the React frontend, but doing so would mean exposing our `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY` directly to the client browser. That's a huge security risk!

Instead, the dashboard frontend sends an HTTP `POST` request to our local Netlify Function (`/.netlify/functions/api`). The serverless function grabs our Supabase API keys securely from the server's environment variables and makes the database queries (`get` and `upsert`) on our behalf. 

This guarantees:
1. API keys are completely hidden from the browser.
2. We don't have to deal with running bulky Docker containers locally (which the Supabase CLI requires).
3. The codebase is incredibly easy to deploy straight to Netlify.

### How to Install & Run

1. **Install Dependencies**
   Run the following to grab all the React and Netlify CLI packages:
   ```bash
   npm install
   ```

2. **Setup your environment variables**
   Create a `.env` file in the root of the project with your Supabase credentials:
   ```env
   VITE_API_URL=http://localhost:8889/.netlify/functions/api
   SUPABASE_URL=your_project_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key_here
   ```

3. **Start the Local Server**
   To start the frontend and the serverless functions together, just run:
   ```bash
   npx netlify dev
   ```
   *Note: Under the hood, this boots up our Vite frontend on port 5173, and the Netlify dev server on port 8889. Everything is cleanly proxied through port 8889, so make sure to open `http://localhost:8889` in your browser!*
