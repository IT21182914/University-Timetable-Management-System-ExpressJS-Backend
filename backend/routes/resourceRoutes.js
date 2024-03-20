const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

// GET all resources
router.get("/", resourceController.getAllResources);

// POST create a new resource
router.post("/", resourceController.createResource);

// PUT update an existing resource
router.put("/:id", resourceController.updateResource);

// DELETE delete a resource
router.delete("/:id", resourceController.deleteResource);

module.exports = router;
