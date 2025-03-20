
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useThemeSetter } from '../useThemeSetter';
import { ProfileData } from '@/hooks/useProfileData';

describe('useThemeSetter', () => {
  beforeEach(() => {
    // Reset the document classes before each test
    document.documentElement.classList.remove('light', 'dark');
  });

  it('should add theme class based on profile preference', () => {
    const profileData: ProfileData = {
      account_type: 'individual',
      display_name: 'Test User',
      business_name: null,
      full_name: 'Test User',
      theme_preference: 'dark',
    };
    
    renderHook(() => useThemeSetter(profileData));
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should handle light theme preference', () => {
    const profileData: ProfileData = {
      account_type: 'individual',
      display_name: 'Test User',
      business_name: null,
      full_name: 'Test User',
      theme_preference: 'light',
    };
    
    renderHook(() => useThemeSetter(profileData));
    
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should do nothing if profile data is null', () => {
    // Set an initial class to verify it doesn't change
    document.documentElement.classList.add('test-class');
    
    renderHook(() => useThemeSetter(null));
    
    expect(document.documentElement.classList.contains('test-class')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should do nothing if theme_preference is null', () => {
    // Set an initial class to verify it doesn't change
    document.documentElement.classList.add('test-class');
    
    const profileData: ProfileData = {
      account_type: 'individual',
      display_name: 'Test User',
      business_name: null,
      full_name: 'Test User',
      theme_preference: null,
    };
    
    renderHook(() => useThemeSetter(profileData));
    
    expect(document.documentElement.classList.contains('test-class')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});
