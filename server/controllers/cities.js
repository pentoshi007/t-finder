const Technician = require('../models/Technician');

exports.getCities = async (req, res) => {
  try {
    const cities = await Technician.distinct('location.city');
    cities.sort((a, b) => a.localeCompare(b));
    res.json(cities);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 