const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");

const dynamoDbInstance = require("./service/dynamo");
const notificationServiceInstance = require("./service/sns");

const THERMAL_KEYWORD = require("./constants").THERMAL;
const createFeedValidator = require("./utils").createFeedPayloadValidator;

const app = express();

app.use(bodyParser.json({ strict: false }));

app.post("/v1/feeds", async (request, response) => {

  const { body: payload } = request;

  createFeedValidation = createFeedValidator(payload)

  if (!createFeedValidation.result) {
    response.status(400).json({ ...createFeedValidation.errors });
    return;
  }

  const { sensors } = payload;

  try {
    await dynamoDbInstance.putItem(payload);

    let notificationPublished = false;

    if (sensors.includes(THERMAL_KEYWORD)) {
      notificationServiceInstance.publish(payload);
      notificationPublished = true;
    }

    response.json({ ...payload, notificationPublished });
  } catch (error) {
    response.status(400).json({ error: `Could not process feed - ${error}` });
  }
});

module.exports.handler = serverless(app);
