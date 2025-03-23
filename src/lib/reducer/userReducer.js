const userReducer = (user, action) => {
    switch (action.type) {
        case 'login':
          return action.payload;
        case 'logout':
          return null;
        case 'update':
          return { ...user, ...action.payload };
        default:
          return user;
      }
}
export default userReducer