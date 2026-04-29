const axios = require('axios');
const moment = require('moment-timezone');

const reqURL = process.env.SLACK_WEBHOOK_URL;

exports.cloudstoragealert = async (event, context) => {
  const timezone = 'Asia/Istanbul';
  const objectKey = event.name;
  const bucket = event.bucket;
  const eventTime = moment.tz(event.timeCreated, timezone).format('DD/MM/YYYY HH:mm:ss');

  let objectSize = Number((event.size / 1024).toFixed(2));
  let objectUnit = 'KB';

  if (objectSize > 1024) {
    objectSize = Number((objectSize / 1024).toFixed(2));
    objectUnit = 'MB';
  }

  const consoleLink = `https://console.cloud.google.com/storage/browser/${bucket}/${objectKey}`;
  const messageTitle = `Upload at bucket ${bucket}`;
  const fieldValue =
    `${objectKey} has been uploaded to bucket successfully on ${eventTime}\n` +
    `File size: ${objectSize} ${objectUnit}\n` +
    `Link: ${consoleLink}`;

  const payload = {
    attachments: [
      {
        fallback: `New upload to ${bucket}`,
        pretext: `New upload to ${bucket}`,
        color: 'good',
        fields: [{ title: messageTitle, value: fieldValue, short: false }],
      },
    ],
  };

  await axios.post(reqURL, payload);
  return `${messageTitle} | Object: ${objectKey}`;
};
