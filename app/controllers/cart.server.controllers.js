const cart = require('../models/cart.server.models');
const {
  createItemSchema,
  updateQuantitySchema
} = require('../validation/cart.validation');

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const validationMessage = (error) => error.details[0].message;

const getAll = (req, res) => {
  cart.getAll((err, items) => {
    if (err) {
      return res.sendStatus(500);
    }

    const numberOfItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce(
      (total, item) => total + (item.item_price * item.quantity),
      0
    );

    return res.status(200).json({
      number_of_items: numberOfItems,
      total_price: Number(totalPrice.toFixed(2)),
      items
    });
  });
};

const create = (req, res) => {
  const { error, value } = createItemSchema.validate(req.body, {
    abortEarly: true,
    convert: false
  });

  if (error) {
    return res.status(400).json({ error: validationMessage(error) });
  }

  return cart.insert(value, (err, item) => {
    if (err) {
      return res.sendStatus(500);
    }

    return res.status(201).json(item);
  });
};

const getOne = (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.sendStatus(404);
  }

  return cart.getOne(id, (err, item) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (!item) {
      return res.sendStatus(404);
    }

    return res.status(200).json(item);
  });
};

const update = (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.sendStatus(404);
  }

  const { error, value } = updateQuantitySchema.validate(req.body, {
    abortEarly: true,
    convert: false
  });

  if (error) {
    return res.status(400).json({ error: validationMessage(error) });
  }

  return cart.updateQuantity(id, value.quantity, (err, item) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (!item) {
      return res.sendStatus(404);
    }

    return res.status(200).json(item);
  });
};

const remove = (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.sendStatus(404);
  }

  return cart.remove(id, (err, item) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (!item) {
      return res.sendStatus(404);
    }

    return res.status(200).send(`${item.item_name} Deleted`);
  });
};

module.exports = {
  getAll,
  create,
  getOne,
  update,
  remove
};
