import React from 'react';

// Define context
// const UserContext = React.createContext({
//  users: [{name: '',
//         email: '',
//         password: '',
//         balance: ''}],
//  setContext: () => {},
// });

// As read in here: https://kentcdodds.com/blog/how-to-use-react-context-effectively, instead of import React and use useContext in any other child, may be better to define useContext here and export the function who defines it:
// function useCtx() {
//     const {users, setContext}= React.useContext(UserContext)
//     if (users === undefined) {
//       throw new Error('useContext used outside its Provider');
//     }
//     return { users, setContext };
//   };

//   export default UserContext;
//   export { useCtx };

const UserContext = React.createContext();
// const ActiveUserContext = React.createContext();

function useCtx() {
    const users = React.useContext(UserContext)
    if (users === undefined) {
      throw new Error('useContext used outside its Provider');
    }
    return users;
  };


  export default UserContext;
  export { useCtx };
