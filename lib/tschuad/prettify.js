const moment = require('moment');

module.exports = function(schedule) {
  const rooms = new Map();
  const attendances = new Map();
  const users = new Map();

  schedule.included.filter(data => data.type === 'room').forEach(room => {
    rooms.set(room.id, room.attributes.name);
  });

  schedule.included.filter(data => data.type === 'attendance').forEach(attendance => {
    attendances.set(attendance.id, attendance);
  })

  schedule.included.filter(data => data.type === 'user').forEach(user => {
    users.set(user.id, user.attributes);
  })

  const data = {};
  schedule.data.forEach(event => {
    const date = moment(event.attributes.start_time).format('YYYY-MM-DD');
    const room = rooms.get(event.relationships.room.data.id);
    const speakers =  event.relationships.attendances.data
      .map(attendance => attendances.get(attendance.id))
      .filter(attendance => attendance.attributes.role === 'speaker')
      .map(attendance => attendance.relationships.user.data.id)
      .map(userId => users.get(userId))
      .map(speaker => ({
        name: `${speaker.firstname} ${speaker.lastname}`,
        image: `https://2018.conc.at/images/speakers/${speaker.firstname.toLowerCase()}_${speaker.lastname.toLowerCase()}_thumb@2x.jpg`
      }));
    
    data[room] = data[room] || {};
    data[room][date] = data[room][date] || [];
    data[room][date].push(Object.assign(event.attributes, { room, speakers }));
  });

  return data;
};
