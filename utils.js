const Ajv = require("ajv");
const feedSchema = require("./fixtures/events/http/feed.json");

const ajv = new Ajv();
const validationSetup = ajv.compile(feedSchema);

exports.createFeedPayloadValidator = (payload) => {
  if (validationSetup(payload)) return { result: true };
  return {
    result: false,
    errors: validationSetup.errors,
  };
};
