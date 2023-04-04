const moment = require('moment-timezone');
const request = require('request');
const {Storage} = require('@google-cloud/storage');

const reqURL = ``;

const storage = new Storage();

exports.cloudstoragealert = (event, context) => {
  var timezone = "Asia/Istanbul";
  var objectType ="Upload";
  var objectKey = event.name;
  var objectSize = Number((event.size / 1024).toFixed(2));
  var objectUnit = "KB";

  if(objectSize > 1024) {
    objectSize = Number((objectSize / 1024).toFixed(2));
    objectUnit = "MB";
  }

  var eventTime = moment.tz(event.timeCreated, timezone).format("DD/MM/YYYY HH:mm:ss");
  var bucket = event.bucket;
  var attachmentTitle = `New upload :oguzhey:`;
  var messageTitle = `${objectType} to bucket - ${bucket}`;
  var messageLevel = "good";
  var filedValueContext = objectKey + " has been uploaded to bucket successfully on " + eventTime + "\n file size: " + objectSize + " " + objectUnit+"\n Link is here: " + `https://console.cloud.google.com/storage/browser/_details/${bucket}/${objectKey}`;

  var actions = event.eventType;

  if(actions === 'OBJECT_FINALIZE'){
    messageTitle = `${objectType} at bucket ${bucket}`;
    messageLevel = "good";
    filedValueContext = objectKey + " has been uploaded to bucket successfully on " + eventTime + "\n file size: " + objectSize + " " + objectUnit + "\n Link is here: " + `https://console.cloud.google.com/storage/browser/${bucket}/${objectKey}`;
  }

  var attachments = {
    "attachments":[
      {
        "fallback": attachmentTitle,
        "pretext": attachmentTitle,
        "color": messageLevel,
        "fields":[
          {
            "title": messageTitle,
            "value": filedValueContext,
            "short": false
          }
        ]
      }
    ]
  };

  var options = {
    uri: reqURL,
    method: 'POST',
    json: attachments
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body.id) // Print the shortened url.
      console.log("body: " + body);
      console.log("Post to slack error: " + error)
    }
  });

  console.log(event);
  console.log(event);

  return messageTitle + ' Object Key:' + objectKey;
};
