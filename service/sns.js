const AWS = require("aws-sdk");

class SimpleNotificationService {
  constructor() {
    this._snsConnection =
      process.env.IS_OFFLINE === true
        ? new AWS.SNS({
            region: process.env.AWS_REGION,
            endpoint: process.env.SNS_ENDPOINT,
          })
        : new AWS.SNS();
  }

  getInstance() {
    return SimpleNotificationService.instance;
  }

  async publish(payload) {
    await this._snsConnection.publish({
      Message: JSON.stringify(payload),
      TopicArn: process.env.SNS_TOPIC,
    }).promise();
  }
}

module.exports = new SimpleNotificationService();
