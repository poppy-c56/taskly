const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/jwt.middleware');

router.use(authenticateToken);
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/my-tasks', taskController.getUserTasks);
router.get('/team/:teamId', taskController.getTeamTasks);
router.get('/:taskId', taskController.getTaskById);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;