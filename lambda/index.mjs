import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const ddb = DynamoDBDocument.from(new DynamoDB({ region: 'us-east-1' }));


export const handler = async(event) => {
  const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};


/// TODO: 
// Database that we can use to display charts
/// Endpoint for scraping urls and writing to that database (with local testing)
