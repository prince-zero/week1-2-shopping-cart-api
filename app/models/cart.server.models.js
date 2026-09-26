const db = require('../../config/database');

const getAll = (done) => {
  db.all(
    'SELECT item_id, item_name, item_price, quantity FROM cart_items ORDER BY item_id',
    [],
    done
  );
};

const getOne = (id, done) => {
  db.get(
    'SELECT item_id, item_name, item_price, quantity FROM cart_items WHERE item_id = ?',
    [id],
    done
  );
};

const insert = (item, done) => {
  const values = [item.item_name, item.item_price, item.quantity];

  db.run(
    'INSERT INTO cart_items (item_name, item_price, quantity) VALUES (?, ?, ?)',
    values,
    function onInsert(err) {
      if (err) {
        return done(err);
      }

      return getOne(this.lastID, done);
    }
  );
};

const updateQuantity = (id, quantity, done) => {
  db.run(
    'UPDATE cart_items SET quantity = ? WHERE item_id = ?',
    [quantity, id],
    function onUpdate(err) {
      if (err) {
        return done(err);
      }

      if (this.changes === 0) {
        return done(null, null);
      }

      return getOne(id, done);
    }
  );
};

const remove = (id, done) => {
  getOne(id, (findErr, item) => {
    if (findErr) {
      return done(findErr);
    }

    if (!item) {
      return done(null, null);
    }

    return db.run(
      'DELETE FROM cart_items WHERE item_id = ?',
      [id],
      (deleteErr) => done(deleteErr, item)
    );
  });
};

module.exports = {
  getAll,
  getOne,
  insert,
  updateQuantity,
  remove
};
