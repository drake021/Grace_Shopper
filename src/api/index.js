const BASE_URL = 'http://localhost:5000/api';
//Register a user
async function fetchRegister(username, password) {
  return await fetch(`/api/users/register`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user: {
              username: username,
              password: password
          }
      })
  })
      .then(response => response.json())
      .then(result => {
          return result;
      })
      .catch(console.error);
}


//Login a user
async function fetchLogin(username, password) {
  return await fetch(`/api/users/login`, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user: {
              username: username,
              password: password
          }
      })
  })
      .then(response => response.json())
      .then(result => {
          return result;
      })
      .catch(console.error)
}


//Return everything in the catalog
async function fetchCatalog() {
    try {
        const allItemsJson = await fetch(`${BASE_URL}/items`);
        const allItems = await allItemsJson.json();
        localStorage.setItem('allItems', JSON.stringify(allItems));
        return allItems;
    } catch (error) {
        throw error;
    }

}


//Return list of users orders
const fetchMyOrders = async (user) => {
  const resp = await fetch(`/api/users/${user.username}/orders`,
      {
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + user.token
          },
      }
  );
  return await resp.json();
};

const getAllItems = async () => {
    try {
        const allItemsJson = await fetch(`${BASE_URL}/items`);
        const allItems = await allItemsJson.json();
        localStorage.setItem('allItems', JSON.stringify(allItems));
        return allItems;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchCatalog,
    fetchRegister,
    getAllItems
};