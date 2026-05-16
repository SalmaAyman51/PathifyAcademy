import axios from 'axios';

// 1. إنشاء نسخة من axios بإعدادات خاصة
// const api = axios.create({
//   // 👈 استبدلي الرابط ده بالرابط اللي سلمى هتديهولك لاحقاً
//   baseURL: 'http://localhost:5087/api', 
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
const api = axios.create({
  baseURL: 'https://localhost:7061/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// 2. "Interceptor" لإضافة التوكن أوتوماتيكياً قبل خروج أي طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      // بنحط التوكن في الـ Header باسم Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 3. "Interceptor" للتعامل مع الردود (خصوصاً لو التوكن خلص)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // لو السيرفر رد بـ 401 يعني التوكن منتهي أو غير صلاح
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized, logging out...");
      
      // نمسح البيانات ونعمل ريفريش يودينا للـ Login
      localStorage.removeItem('userToken');
      localStorage.removeItem('pathify_user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
}
);

export default api;