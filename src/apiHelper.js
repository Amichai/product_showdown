import { v4 as uuidv4 } from 'uuid'

export const queryShowdown = async (guid) => {
  const response = await fetch(`https://g735qk4285.execute-api.us-east-1.amazonaws.com/dev/showdown?showdownId=${guid}`)
  const data = await response.json()
  console.log("AAAA")
  console.log(data)
  return data['Item']
}

export const updateShowdown = async (guid, name, table, order) => {
  const data = {
    showdownId: guid,
    name: encodeURIComponent(name),
    table: encodeURIComponent(JSON.stringify(table)),
    featureOrder: encodeURIComponent(JSON.stringify(order))
  };

  fetch('https://g735qk4285.execute-api.us-east-1.amazonaws.com/dev/showdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

export const postShowdownUrl = async (url) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain");

  const data = {
    url
  }
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };
  
  const response = await fetch("https://g735qk4285.execute-api.us-east-1.amazonaws.com/dev/parseurl", requestOptions)
  const asJson = await response.json()
  console.log(asJson)
  
  return asJson
}


// export const persistToDb = async (bookTitle, key, value) => {
//   let data = { userId: `user1-${bookTitle}`, key, value };

//   fetch('https://ar0iqyq84j.execute-api.us-east-1.amazonaws.com/dev/settings', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   .then(response => response.json())
//   .then(data => console.log('Success:', data))
//   .catch((error) => console.error('Error:', error));
// }