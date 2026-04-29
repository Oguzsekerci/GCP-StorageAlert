# GCP Cloud Storage Alert → Slack

A Google Cloud Function that sends a Slack notification whenever a file is uploaded to a Cloud Storage bucket.

## How It Works

1. A Cloud Storage event triggers the function on `OBJECT_FINALIZE` (new/overwritten objects)
2. Extracts filename, size, and timestamp
3. Posts a formatted message to your Slack channel via an incoming webhook

## Setup

### 1. Set Environment Variable

| Variable | Value |
|---|---|
| `SLACK_WEBHOOK_URL` | Your full Slack incoming webhook URL |

Create a Slack incoming webhook at [api.slack.com/apps](https://api.slack.com/apps).

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy

```bash
gcloud functions deploy cloudstoragealert \
  --runtime nodejs18 \
  --trigger-event google.storage.object.finalize \
  --trigger-resource YOUR_BUCKET_NAME \
  --region europe-west1 \
  --set-env-vars SLACK_WEBHOOK_URL=YOUR_WEBHOOK_URL
```

## Dependencies

- [axios](https://github.com/axios/axios) — HTTP client for Slack webhook
- [moment-timezone](https://momentjs.com/timezone/) — Timestamp formatting (Asia/Istanbul)

## Slack Message Format

```
New upload to bucket my-bucket
my-folder/file.zip has been uploaded to bucket successfully on 29/04/2026 14:32:00
File size: 3.2 MB
Link: https://console.cloud.google.com/storage/browser/my-bucket/my-folder/file.zip
```
