# Tally Form Integration for Lawlify Kockpit

## Overview
This integration allows you to connect Tally forms to your Kockpit admin dashboard. When users submit a Tally form, the data will automatically appear in your dashboard.

## Setup Instructions

### Step 1: Run the Migration
Run the new migration to create the `tally_submissions` table:

```bash
# In your Supabase dashboard, run the SQL in:
supabase/migrations/007_tally_submissions.sql
```

Or via CLI:
```bash
supabase db push
```

### Step 2: Configure Tally Webhook
1. Open your Tally form at https://tally.so
2. Go to **Settings** → **Integrations** → **Webhooks**
3. Click **Add webhook**
4. Enter your webhook URL:
   ```
   https://YOUR_BACKEND_URL/api/webhooks/tally?apiKey=YOUR_TALLY_API_KEY
   ```
   - For local development: `http://localhost:3000/api/webhooks/tally?apiKey=YOUR_TALLY_API_KEY`
   - For production: `https://your-production-url.com/api/webhooks/tally?apiKey=YOUR_TALLY_API_KEY`
5. Set the trigger to "Form is submitted"
6. Save the webhook

### Step 3: Set Up API Key (Optional but Recommended)
Add the API key to your backend `.env` file:

```env
# backend-service/.env
TALLY_API_KEY=lawlify_tally_2024_secure_key
```

> **Your API Key**: `lawlify_tally_2024_secure_key`
> You can use this key directly, or generate your own with: `openssl rand -hex 32`

### Step 3: Test the Integration
After setting up the webhook:
1. Submit a test entry in your Tally form
2. Check your Kockpit dashboard
3. The submission should appear in the notifications or submissions list

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhooks/tally` | POST | Receives Tally form submissions |
| `/api/tally/submissions` | GET | Fetches all submissions (for Kockpit) |
| `/api/tally/submissions/:id/read` | PATCH | Marks a submission as read |

## Backend URL
Make sure your backend URL is accessible from Tally:
- **Production**: Update your `BACKEND_URL` environment variable
- **Local Development**: Use ngrok or similar to expose localhost:
  ```bash
  npx ngrok http 3000
  ```

## Troubleshooting

1. **Webhooks not reaching backend**: 
   - Check that your backend is running
   - Verify the webhook URL is correct in Tally
   - Check backend logs for `[TALLY]` entries

2. **Data not showing in Kockpit**:
   - Ensure the migration was run successfully
   - Check Supabase table `tally_submissions` has data
   - Verify you're authenticated when calling the GET endpoint
