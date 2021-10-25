const AWS = require("aws-sdk");

class DynamoDB {
  constructor() {
      this._dynamoConnection =
        process.env.IS_OFFLINE === true
          ? new AWS.DynamoDB.DocumentClient({
              region: process.env.AWS_REGION,
              endpoint: process.env.DYNAMODB_ENDPOINT,
            })
          : new AWS.DynamoDB.DocumentClient();
  }

  getInstance() {
    return DynamoDB.instance;
  }

  async putItem(params) {
    await this._dynamoConnection
      .put({
        TableName: process.env.FEED_TABLE,
        Item: params,
      })
      .promise();
  }
}

module.exports = new DynamoDB();
