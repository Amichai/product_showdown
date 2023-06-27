import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import * as cheerio from 'cheerio';
import axios from 'axios';



const ddb = DynamoDBDocument.from(new DynamoDB({ region: 'us-east-1' }));


export const handler = async(event) => {
  const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};

const parseSpecifications = (scrapedContent) => {

}


const scrapeUrl = (url) => {
  axios
  .get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    $('p').each(function(i, elem) {
      const toLog = $(this).text().trim()
      let result = toLog.replace(/\s{2,}/g, '\n');
      console.log(result);

      console.log("--")
    });
  })
  .catch((err) => console.log("Fetch error " + err));
}

const url1 = 'https://www.apple.com/iphone/?afid=p238%7CsTz1DSvwo-dc_mtid_20925d2q39172_pcrid_657090799413_pgrid_126654828629_pntwk_g_pchan__pexid__&cid=wwa-us-kwgo-iphone--slid---Brand-iPhone--'
const url2 = 'https://www.codeofbell.com/products/x-type-backpack?variant=44078938652990'
scrapeUrl(url2)


/// TODO: 
// Database that we can use to display charts
/// Endpoint for scraping urls and writing to that database (with local testing)

///Databases
/// URL - url, scraped content, parsed specifications
///Product battle - URL ids, table digest, custom fields 