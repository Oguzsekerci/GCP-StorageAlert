const moment = require('moment-timezone');
const request = require('request');

// Set your Slack incoming webhook URL here
const reqURL = `YOUR_SLACK_WEBHOOK_URL`;

exports.cloudstoragealert = (event, context) => {
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

  const attachments = {
    attachments: [
      {
        fallback: `New upload to ${bucket}`,
        pretext: `New upload to ${bucket}`,
        color: 'good',
        fields: [
          {
            title: messageTitle,
            value: fieldValue,
            short: false,
          },
        ],
      },
    ],
  };

  const options = {
    uri: reqURL,
    method: 'POST',
    json: attachments,
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.error('Slack request failed:', error);
      return;
    }
    if (response.statusCode !== 200) {
      console.error('Slack returned non-200:', response.statusCode, body);
      return;
    }
    console.log('Slack notification sent:', body);
  });

  return `${messageTitle} | Object: ${objectKey}`;
};
