"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourController_1 = require("../controllers/tourController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/public', tourController_1.getToursValidation, tourController_1.getTours);
router.get('/public/categories', tourController_1.getToursByCategory);
router.get('/public/:id', tourController_1.getTour);
// Admin routes (authentication required)
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
// Admin tour management
router.get('/stats', tourController_1.getTourStats);
router.get('/', tourController_1.getToursValidation, tourController_1.getTours);
router.post('/', tourController_1.createTourValidation, tourController_1.createTour);
router.get('/:id', tourController_1.getTour);
router.put('/:id', tourController_1.updateTourValidation, tourController_1.updateTour);
router.delete('/:id', tourController_1.deleteTour);
exports.default = router;
//# sourceMappingURL=tours.js.map