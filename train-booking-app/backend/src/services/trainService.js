import { db, createId } from '../repositories/db.js';

const CLASS_MULTIPLIER = {
  Sleeper: 1.0,
  AC3: 1.4,
  AC2: 1.8,
  Business: 2.1
};

function stationByCode(code) {
  return db.stations.find((station) => station.code.toLowerCase() === String(code).toLowerCase());
}

export function searchTrains({ from, to, date, classType = 'Sleeper' }) {
  const source = stationByCode(from);
  const destination = stationByCode(to);

  if (!source || !destination) {
    return [];
  }

  const matched = db.trains.filter((train) => train.source_station_id === source.id && train.destination_station_id === destination.id);

  return matched.map((train) => {
    const baseFare = 80;
    const fare = Number((baseFare * (CLASS_MULTIPLIER[classType] || 1)).toFixed(2));
    const schedule = {
      id: createId('SCH'),
      train_id: train.id,
      journey_date: date,
      available_seats: 120,
      fare
    };

    return {
      ...train,
      from: source,
      to: destination,
      schedule,
      duration: '2h 20m',
      class_type: classType
    };
  });
}

export function getTrainById(id) {
  return db.trains.find((train) => train.id === id);
}

export function addTrain(payload) {
  const train = { id: createId('TRN'), ...payload };
  db.trains.push(train);
  return train;
}

export function updateTrain(id, payload) {
  const index = db.trains.findIndex((train) => train.id === id);
  if (index < 0) {
    return null;
  }
  db.trains[index] = { ...db.trains[index], ...payload };
  return db.trains[index];
}

export function deleteTrain(id) {
  const index = db.trains.findIndex((train) => train.id === id);
  if (index < 0) {
    return false;
  }
  db.trains.splice(index, 1);
  return true;
}
