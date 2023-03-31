const express = require('express');

const groupController = require('../controllers/group');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/create/group', authenticate.authentication, groupController.createGroup);

router.get('/group/mygroups', authenticate.authentication, groupController.getMyGroups);

router.get('/group/othergroups', authenticate.authentication, groupController.getOtherGroups);

router.delete('/group/delete/:delId', authenticate.authentication, groupController.deleteGroup);

router.get('/group/join/:joinId', authenticate.authentication, groupController.joinGroup);

module.exports = router;