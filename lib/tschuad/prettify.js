const moment = require('moment');

module.exports = function(schedule) {
  const rooms = new Map();
  schedule.included.filter(data => data.type === 'room').forEach(room => {
    rooms.set(room.id, room.attributes.name);
  });

  const data = {};
  schedule.data.forEach(event => {
    const date = moment(event.attributes.start_time).format('YYYY-MM-DD');
    const room = rooms.get(event.relationships.room.data.id);

    data[room] = data[room] || {};
    data[room][date] = data[room][date] || [];
    data[room][date].push(Object.assign(event.attributes, { room }));
  });

  return data;
};
