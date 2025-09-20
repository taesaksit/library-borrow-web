export const handleLogout = (navigate: (path: string) => void) => {
  localStorage.clear();
  navigate("/");
};
