module.exports = function(repository) {
  const todos = repository.extend({
    collectionName: 'todos'
  });


  return {

    get(callback) {
      return todos.find({}, (err, vms) => {
        if (err || !vms.length) return callback(err, []);
        return callback(null, vms.toJSON());
      });
    },

    add(item, callback) {
      todos.get((err, vm) => {
        if (err) return callback(err);

        vm.set(item);

        vm.commit(err => {
          if (err) return callback(err);

          callback(null, vm.toJSON());
        });
      });
    },

    update(id, item, callback) {
      todos.get(id, (err, vm) => {
        if (err) return callback(err);

        vm.set(item);

        vm.commit(err => {
          if (err) return callback(err);

          callback(null, vm.toJSON());
        });
      });
    },

    delete(id, callback) {
      todos.get(id, (err, vm) => {
        if (err) return callback(err);

        vm.destroy();

        vm.commit(err => {
          if (err) return callback(err);

          callback(null, vm.toJSON());
        });
      });
    }

  };

}
