import * as trainService from '../services/trainService.js';

export function searchTrains(req, res) {
  const result = trainService.searchTrains(req.query);
  return res.json(result);
}

export function getTrain(req, res) {
  const train = trainService.getTrainById(req.params.id);
  if (!train) {
    return res.status(404).json({ message: 'Train not found' });
  }
  return res.json(train);
}

export function addTrain(req, res) {
  const train = trainService.addTrain(req.body);
  return res.status(201).json(train);
}

export function updateTrain(req, res) {
  const train = trainService.updateTrain(req.params.id, req.body);
  if (!train) {
    return res.status(404).json({ message: 'Train not found' });
  }
  return res.json(train);
}

export function deleteTrain(req, res) {
  const ok = trainService.deleteTrain(req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Train not found' });
  }
  return res.status(204).send();
}
