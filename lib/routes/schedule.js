const fetch = require('node-fetch');
const Lanyrd = require('lanyrd');

module.exports = function(app, lib) {
  app.get('/schedule', function(req, res) {
    app.debug('sending schedule...');
    const festivalId = app.configjs.tschuad.id;
    fetch(
      `https://gwant.herokuapp.com/festivals/${festivalId}/events?include=room,attendances,attendances.user`
    )
      .then(res => res.json())
      .then(schedule => res.json(lib.tschuad.prettify(schedule)))
      .catch(err => res.status(500).json({ error: err.message, trace: err.stack }));
  });
};
