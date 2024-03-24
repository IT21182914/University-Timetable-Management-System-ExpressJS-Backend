const resourceController = require("../controllers/resourceController");
const Resource = require("../models/resourceModel");

jest.mock("../models/resourceModel");

describe("Resource Controller", () => {
  describe("getAllResources", () => {
    it("should return all resources", async () => {
      const mockResources = [{ name: "Resource 1" }, { name: "Resource 2" }];
      Resource.find.mockResolvedValue(mockResources);
      const req = {};
      const res = { json: jest.fn() };

      await resourceController.getAllResources(req, res);

      expect(Resource.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockResources);
    });

    it("should handle errors when fetching resources", async () => {
      const errorMessage = "Database error";
      Resource.find.mockRejectedValue(new Error(errorMessage));
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await resourceController.getAllResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("createResource", () => {
    it("should create a new resource", async () => {
      const req = {
        body: {
          name: "New Resource",
          description: "Description",
          quantity: 10,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const savedResource = { _id: "newResourceID", ...req.body };
      Resource.prototype.save.mockResolvedValue(savedResource);

      await resourceController.createResource(req, res);

      expect(Resource.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource created successfully",
        resource: savedResource,
      });
    });

    it("should handle errors when creating a resource", async () => {
      const errorMessage = "Database error";
      Resource.prototype.save.mockRejectedValue(new Error(errorMessage));
      const req = {
        body: {
          name: "New Resource",
          description: "Description",
          quantity: 10,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await resourceController.createResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("updateResource", () => {
    it("should update an existing resource", async () => {
      const resourceId = "resourceId";
      const req = {
        params: { id: resourceId },
        body: { name: "Updated Resource" },
      };
      const res = { json: jest.fn() };

      const updatedResource = {
        _id: resourceId,
        name: "Updated Resource",
        description: "Description",
        quantity: 10,
      };
      Resource.findByIdAndUpdate.mockResolvedValue(updatedResource);

      await resourceController.updateResource(req, res);

      expect(Resource.findByIdAndUpdate).toHaveBeenCalledWith(
        resourceId,
        req.body,
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource updated successfully",
        resource: updatedResource,
      });
    });

    it("should handle errors when updating a resource", async () => {
      const errorMessage = "Database error";
      Resource.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));
      const req = {
        params: { id: "resourceId" },
        body: { name: "Updated Resource" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await resourceController.updateResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("deleteResource", () => {
    it("should delete a resource", async () => {
      const resourceId = "resourceId";
      const req = { params: { id: resourceId } };
      const res = { json: jest.fn() };

      await resourceController.deleteResource(req, res);

      expect(Resource.findByIdAndDelete).toHaveBeenCalledWith(resourceId);
      expect(res.json).toHaveBeenCalledWith({
        message: "Resource deleted successfully",
      });
    });

    it("should handle errors when deleting a resource", async () => {
      const errorMessage = "Database error";
      Resource.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));
      const req = { params: { id: "resourceId" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await resourceController.deleteResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
