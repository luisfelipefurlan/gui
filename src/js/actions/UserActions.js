/* eslint-disable */
import userManager from '../comms/users/UserManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class UserActions {
    updateUsers(list) {
        return list;
    }

    insertUser(user) {
        return user;
    }

    addUser(user, cb, error_cb) {
        const newUser = user;
        return (dispatch) => {
        dispatch();
        userManager.addUser(newUser)
            .then((response) => {
            // @bug: backend won't return full public record of the created user, so merge the
            //       server-side data (id) with the known record of the user.
            let updatedUser = JSON.parse(JSON.stringify(newUser));
            updatedUser['id'] = response[0].user.id;
            updatedUser['passwd'] = '';
            this.insertUser(updatedUser);
            if(cb){
                cb(response);
            }
            })
            .catch((error) => {
            if(error_cb) {
                error_cb(newUser);
            }
            this.usersFailed(error);
            // error.data.json()
                // .then((data) => {
                //   if (error_cb) {
                //     error_cb(data);
                //   }
                // })
            })
        }
    }

    fetchUsers() {
        return (dispatch) => {
            dispatch();
            userManager.getUsers()
                .then((userList) => {
                    this.updateUsers(userList.users);
                })
                .catch((error) => {
                    this.usersFailed(error);
                });
        };
    }

    triggerUpdate(user, cb, error_cb) {
        return (dispatch) => {
            dispatch();
            // special case (for now): allow edits to not repeat the password
            // if (user.passwd.trim().length === 0) {
            //   delete user.passwd;
            // }

            userManager.setUser(user)
                .then((response) => {
                    this.updateSingle(user);
                    if (cb) {
                        cb();
                    }
                })
                .catch((error) => {
                    this.usersFailed(error);
                    // error.data.json()
                    //   .then((data) => {
                    //     if (error_cb) {
                    //       error_cb(data);
                    //     }
                    //   })
                });
        };
    }

    triggerRemoval(user, cb) {
        return (dispatch) => {
            dispatch();
            userManager.deleteUser(user.id)
                .then((response) => {
                    this.removeSingle(user.id);
                    if (cb) {
                        cb(response);
                    }
                })
                .catch((error) => {
                    this.usersFailed(error);
                });
        };
    }

    updateSingle(user) {
        return user;
    }

    removeSingle(user) {
        return user;
    }

    usersFailed(error) {
        toaster.error(error.message);
        return error;
    }
}

const _user = alt.createActions(UserActions, exports);
export default _user;
