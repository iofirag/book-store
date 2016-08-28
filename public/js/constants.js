angular.module('bookstore.constants', [])

.constant('endpoints', {
    UPLOAD_IMAGE : 'http://autophoto.herokuapp.com/uploadImage'
})

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})


/* Temporary Data (modifiable) */
// .value('usersOnline', 0);