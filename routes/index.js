const apiRouter = require('express').Router();
const{
  getAllItems
} = require('../db');

apiRouter.get('/api/items', async (req, res, next) => {
  try {
    const returnedItems = await getAllItems();

    res.send(
      returnedItems
    );
  } catch (error) {
    next(error);
  }
});


module.exports = apiRouter;
