const Resource = require("../models/resourceModel");

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    const { name, description, quantity } = req.body;
    const newResource = new Resource({ name, description, quantity });
    await newResource.save();
    res.status(201).json({
      message: "Resource created successfully",
      resource: newResource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing resource
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      message: "Resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await Resource.findByIdAndDelete(id);
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
