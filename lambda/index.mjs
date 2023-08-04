import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import * as cheerio from 'cheerio';
import axios from 'axios';
// const { Configuration, OpenAIApi } = require("openai");
import { Configuration, OpenAIApi } from "openai";

const ddb = DynamoDBDocument.from(new DynamoDB({ region: 'us-east-1' }));

const writeUrlToDb = async (url, scrapedContent, features, imageUrl) => {
  const timestamp = (Date.now() / 1000).toString();
  const item = {
    url,
    timestamp,
    scrapedContent,
    imageUrl,
    features: JSON.stringify(features)
  }

  const params = {
    TableName: 'ProductShowdown_Urls',
    Item: item
  };

  try {
    const data = await ddb.put(params);
    console.log("Item successfully stored:", data);

    return item
  } catch (err) {
    console.error("Error: ", err);
  }
}

const queryUrlFromDb = async (url) => {
  const params = {
    TableName: "ProductShowdown_Urls",
    KeyConditionExpression: "#key = :value",
    ExpressionAttributeNames: {
        "#key": "url"
    },
    ExpressionAttributeValues: {
        ":value": url
    },
    ScanIndexForward: false
  };

  try {
      // perform the query
      const data = await ddb.query(params);
      // handle the response data
      return data.Items[0];
  } catch (err) {
      // handle any errors
      console.error(err);
      throw err;
  }
}

const getFeatures = async (scrapedContent) => {
  console.log("get features")
  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Below is a table containing details about the attributes of the following product and comparing that product to a generic version of the same. The columns are the different products and the rows are the different product attributes.\n\nBelow is a JSON object containing details about the frollowing project. There is no nesting in the JSON object. The object takes the from:\n\n{\n\"name\": <product name>,\n\"attribute one\": <value>,\n\"attribute two\": <value>\n}\n\nProduct Details:\n${scrapedContent}\n\nJSON Object:\n{\n\"name\":`,
    temperature: 0,
    max_tokens: 1100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.data
}

const extractFeatureJSON = async (scrapedContent) => {
  console.log("extract feature JSON")
  const result = await getFeatures(scrapedContent)

  const featureJSON = {}
  const resultText = result.choices[0].text
  const lines = resultText.split('\n')

  featureJSON['name'] = lines[0].trim('').replace(new RegExp('",$'), "").replace(new RegExp('^"'), "")

  const splitString = '": "'
  for(let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const splitIndex = line.indexOf(splitString)
    if(splitIndex === -1) {
      continue
    }

    const key = line.substring(1, splitIndex)
    const value = line.substring(splitIndex + 4, line.length - 2)

    featureJSON[key] = value
  }
  
  return featureJSON
}

const scrapeUrl = async (url) => {
  try {
    const response = await axios.get(url);

    const $ = cheerio.load(response.data);
    const main = $('main').text()
        .replace(/\s+/g, ' ')
        .slice(0, 3000);

    // console.log(main)
    // console.log('------------------')

    const allImages = $('img')
    const selectedImage = allImages[Math.floor(Math.random()*allImages.length)];
    const imageUrl = $(selectedImage).attr('src')

    // const imageUrl = $('img').first().attr('src');

    // const main = $('main')
    // let total = ''
    // const paragraphs = $('main p')
    // paragraphs.each((i, paragraph) => {
    //   total += $(paragraph).text().trim()
    //   // console.log($(paragraph).text().trim())
    // })
    
    const features = await extractFeatureJSON(main)
    
    return await writeUrlToDb(url, main, features, imageUrl)
  } catch (err) {
    console.log("Fetch error " + err);
  }
}

export const handler = async (event) => {
  const url = event['url']
  const dbRow = await queryUrlFromDb(url)
  let scraped;
  if (!dbRow) {
    scraped = await scrapeUrl(url)
  } else {
    scraped = dbRow
  }

  // take the scraped content, and the extracted features and use it to generate the comparison?


  const response = {
    statusCode: 200,
    body: JSON.stringify(scraped),
  };
  return response;
};


const tags = ['html', 
'head', 'body', 'section', 'main',
'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'ol', 'dl', 'dt', 'dd', 'table', 'tr', 'td'];



const htmlToObj = (element) => {
  // Base case: if it's a text node, return its value
  if (element.type === 'text') return element.data.trim();

  if (!tags.includes(element.name)) return null;

  let node = {};

  // Get tag name
  node.tag = element.name;

  // Get attributes
  // if (Object.keys(element.attribs).length > 0) {
  //   node.attr = element.attribs;
  // }

  // Get children
  if (element.children.length > 0) {
    node.children = element.children
      .filter((child) => child.type === 'tag' || child.type === 'text' && child.data.trim() !== '')
      .map((child) => htmlToObj(child))
      .filter((child) => child !== null);;
  }

  if(!node?.children?.length){
    delete node.children;

    return null;
  }



  return node;
};


const scrapeWebsiteTest = async () => {
  // const url = 'https://www.apple.com/iphone-14-pro/specs/'
  const url = 'https://www.codeofbell.com/products/x-type-backpack?variant=44078938652990'
  const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const yamlObj = $('html').toArray().map((element) => htmlToObj(element));

    // let allDivs = ''
    // $('main').find('div').each((i, element) => {
    //   const text = $(element).text().trim();
    //   allDivs += text
    //   console.log(`${text.length} - ${text}`)
    // })

    console.log(JSON.stringify(yamlObj))
    
    // console.log($.html());
    // const justDivs = cheerio.load(allDivs).text()

    // console.log(justDivs)

    // const main = $('main').text()
    //     .replace(/\s+/g, ' ')
    //     .slice(0, 3000);

    // console.log(main)
    // console.log('------------------')
}


await scrapeWebsiteTest()

// await handler({url: 'https://www.apple.com/iphone-14-pro/specs/'})


// const url = 'https://www.apple.com/iphone-14-pro/specs/'
// const url = 'https://en.wikipedia.org/wiki/IPhone'
// const url2 = 'https://www.codeofbell.com/products/x-type-backpack?variant=44078938652990'
// scrapeUrl(url2)
// const url = 'https://www.amazon.com/Everyday-Essentials-Olympic-Bumper-Weight/dp/B098C97SXN'
// const result = await scrapeUrl(url)
// console.log(result)

/// TODO: 
// Database that we can use to display charts
/// Endpoint for scraping urls and writing to that database (with local testing)

///Databases
/// URL - url, scraped content, parsed specifications
///Product battle - URL ids, table digest, custom fields 

// const result = await handler({url: 'https://www.codeofbell.com/products/x-type-backpack?variant=44078938652990'})

// console.log(result)

// console.log('-----')

// const url = 'https://www.codeofbell.com/products/x-type-backpack?variant=44078938652990'

// const response = await axios.get(url);
//   // console.log(response.data)

// const $ = cheerio.load(response.data);
// const main = $('main').text()
//     .replace(/\s+/g, ' ')
//     .slice(0, 3000);

// // console.log(main)
// // console.log('------------------')

// const allImages = $('img[src]')

// console.log(allImages.length)
// const selectedImage = allImages[Math.floor(Math.random()*allImages.length)];
// // console.log(selectedImage)
// const imageUrl = $(selectedImage).attr('src')

// console.log(imageUrl)


// https://www.ssense.com/en-us/men/product/cote-and-ciel/navy-small-oril-backpack/12724851