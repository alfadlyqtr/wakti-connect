
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  /**
   * Redirects user to login page with a return URL
   * @param returnUrl Optional URL to redirect to after successful login
   */
  const redirectToLogin = useCallback((returnUrl?: string) => {
    const encoded = returnUrl ? encodeURIComponent(returnUrl) : '';
    const redirectPath = `/auth/login${encoded ? `?returnUrl=${encoded}` : ''}`;
    navigate(redirectPath);
  }, [navigate]);

  /**
   * Redirects user to registration page with optional return URL
   * @param returnUrl Optional URL to redirect to after registration
   */
  const redirectToRegister = useCallback((returnUrl?: string) => {
    const encoded = returnUrl ? encodeURIComponent(returnUrl) : '';
    const redirectPath = `/auth/register${encoded ? `?returnUrl=${encoded}` : ''}`;
    navigate(redirectPath);
  }, [navigate]);

  return {
    redirectToLogin,
    redirectToRegister
  };
};
