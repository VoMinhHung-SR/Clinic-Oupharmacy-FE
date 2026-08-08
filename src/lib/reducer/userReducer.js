import { normalizeClientUser } from '../auth';

const userReducer = (user, action) => {
    switch (action.type) {
        case 'login':
          return normalizeClientUser(action.payload);
        case 'logout':
          return null;
        case 'update':
          return normalizeClientUser({ ...user, ...action.payload });
        default:
          return user;
      }
}
export default userReducer