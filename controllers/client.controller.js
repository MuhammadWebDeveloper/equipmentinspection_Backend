const Client = require('../models/Client.model');

// GET /api/clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/clients
const createClient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: 'Client name is required' });
    const client = await Client.create({ name, email, phone, address, createdBy: req.user._id });
    res.status(201).json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/clients/:id
const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const { name, email, phone, address } = req.body;
    client.name = name || client.name;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.address = address || client.address;
    await client.save();
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getClients, createClient, updateClient, deleteClient };
