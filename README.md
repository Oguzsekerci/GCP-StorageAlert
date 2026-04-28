# GCP Cloud Storage Alert → Slack

GCP Cloud Function that sends a Slack notification whenever a file is uploaded to a Cloud Storage bucket.

## How it works

1. A Cloud Storage event triggers the function on `OBJECT_FINALIZE` (new/overwritten objects).
2. The function extracts the file name, size, bucket, and upload timestamp.
3. It posts a formatted message to your Slack channel via an incoming webhook.

## Setup

### 1. Set your Slack webhook URL

Open `index.js` and replace the placeholder:

```js
const reqURL = `YOUR_SLACK_WEBHOOK_URL`;
```

Create a webhook at [api.slack.com/apps](https://api.slack.com/apps) → Incoming Webhooks.

### 2. Install dependencies

```bash
npm install moment-timezone request @google-cloud/storage
```

### 3. Deploy the Cloud Function

```bash
gcloud functions deploy cloudstoragealert \
  --runtime nodejs18 \
  --trigger-resource YOUR_BUCKET_NAME \
  --trigger-event google.storage.object.finalize \
  --region europe-west1
```

Replace `YOUR_BUCKET_NAME` and `--region` as needed.

## Example Slack message

```
New upload to my-bucket
photo.jpg has been uploaded to bucket successfully on 29/04/2026 14:32:10
File size: 2.1 MB
Link: https://console.cloud.google.com/storage/browser/my-bucket/photo.jpg
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `moment-timezone` | Timestamp formatting in Istanbul timezone |
| `request` | HTTP POST to Slack webhook |
| `@google-cloud/storage` | GCP Storage SDK |
