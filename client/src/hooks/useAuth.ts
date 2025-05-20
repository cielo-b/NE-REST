import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import { login, signup, logout } from "../features/auth/auth.slice";
import { ERole } from "../enums/ERole";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        if (result.payload.user.role === ERole.ADMIN) {
          navigate("/admin/dashboard");
        } else if (result.payload.user.role === ERole.ATTENDANT) {
          navigate("/attendant/dashboard");
        }
      }
    },
    [dispatch, navigate]
  );

  const handleSignup = useCallback(
    async (name: string, email: string, password: string, role: ERole) => {
      const result = await dispatch(signup({ name, email, password, role }));
      if (signup.fulfilled.match(result)) {
        if (result.payload.user.role === ERole.ADMIN) {
          navigate("/admin/dashboard");
        } else if (result.payload.user.role === ERole.ATTENDANT) {
          navigate("/attendant/dashboard");
        }
      }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
}; 