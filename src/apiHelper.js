import { v4 as uuidv4 } from 'uuid'

export const queryShowdown = async (guid) => {
    const response = await fetch(`https://g735qk4285.execute-api.us-east-1.amazonaws.com/dev/showdown?showdownId=${guid}`)
  const data = await response.json()
    console.log("AAAA")
    console.log(data)
  return data['Item']
}

export const updateShowdown = async (guid, name, table, order) => {
    let data = {
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