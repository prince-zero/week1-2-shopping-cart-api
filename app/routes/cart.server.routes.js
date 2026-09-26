const cart = require('../controllers/cart.server.controllers');

module.exports = (app) => {
  app.route('/cart')
    .get(cart.getAll)
    .post(cart.create);

  app.route('/cart/:id')
    .get(cart.getOne)
    .patch(cart.update)
    .delete(cart.remove);
};
