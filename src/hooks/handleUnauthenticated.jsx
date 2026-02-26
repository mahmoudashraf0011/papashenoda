// utils/handleUnauthenticated.js

export function handleUnauthenticated(error) {
  // بنشوف إذا كان الخطأ بسبب انتهاء التوكن
  if (
    error?.response?.data?.message === "Unauthenticated" ||
    error?.response?.status === 401
  ) {
    console.warn("Token expired or invalid. Logging out...");

    // نحذف القيم الخاصة بالمستخدم
    localStorage.removeItem("token_popeShounda");
    localStorage.removeItem("user_popeShounda");
    localStorage.removeItem("pass_popeShounda");

    // نعمل redirect للـ login
    window.location.href = "/login";
  }

  // نرمي الخطأ علشان الكود اللي بينادي يعرف برضو إنه حصل error
  throw error;
}
