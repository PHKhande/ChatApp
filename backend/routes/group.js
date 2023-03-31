const express = require('express');

const groupController = require('../controllers/group');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/create/group', authenticate.authentication, groupController.createGroup);

router.get('/group/mygroups', authenticate.authentication, groupController.getMyGroups);

router.get('/group/othergroups', authenticate.authentication, groupController.getOtherGroups);

router.delete('/group/delete/:delId', authenticate.authentication, groupController.deleteGroup);

router.get('/group/join/:joinId', authenticate.authentication, groupController.joinGroup);

router.get('/user/group', authenticate.authentication, groupController.getAllUsersofGroup);

router.get('/admin/group', authenticate.authentication, groupController.getAdminsofGroup);

router.get('/user/to/admin', authenticate.authentication, groupController.makeUserAdminofGroup);

router.get('/admin/to/user', authenticate.authentication, groupController.makeAdminUserofGroup);

router.post('/addUser', authenticate.authentication, groupController.addUsertoGroup);




module.exports = router;