// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('pathify_user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   // const login = (userData) => {
//   //   setUser(userData);
//   //   localStorage.setItem('pathify_user', JSON.stringify(userData));
//   // };
// const login = (userData) => {
//     const normalizedUser = {
//         ...userData,
//         role: userData.role?.toLowerCase()
//     };
//     setUser(normalizedUser);
//     localStorage.setItem('pathify_user', JSON.stringify(normalizedUser));
    
//     // ✅ ده اللي كان ناقص — حفظ التوكن عشان الـ api.js يلاقيه
//     if (userData.token) {
//         localStorage.setItem('userToken', userData.token);
//     }
// };
//  const logout = () => {
//     setUser(null);
//     localStorage.removeItem('pathify_user');
//     localStorage.removeItem('userToken'); // ✅ ضيفي السطر ده
// };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pathify_user');
    const savedToken = localStorage.getItem('userToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    } else {
      // لو واحد منهم مش موجود امسح الاتنين
      localStorage.removeItem('pathify_user');
      localStorage.removeItem('userToken');
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase()
    };
    setUser(normalizedUser);
    localStorage.setItem('pathify_user', JSON.stringify(normalizedUser));
    if (userData.token) {
      localStorage.setItem('userToken', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pathify_user');
    localStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};