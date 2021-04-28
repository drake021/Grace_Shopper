
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


//return a user
async function fetchMe(token) {
  return await fetch(`/api/users/me`, {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      }
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
      const response = await fetch(`/api/items`)
      const data = await response.json();
      return data;
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

export {
    fetchCatalog
};