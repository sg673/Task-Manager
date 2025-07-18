/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom/vitest';

// Mock dependencies
vi.mock('../hooks/useAuth');
vi.mock('react-router-dom');
vi.mock('react-hot-toast');

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mocks
    (useAuth as any).mockReturnValue({ login: mockLogin });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates form values on input change', () => {
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls login function with correct credentials on form submission', async () => {
    mockLogin.mockResolvedValueOnce(true);
    
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('shows loading state during login process', async () => {
    // Make login function delay to show loading state
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
    });
  });

  it('navigates to dashboard and shows success toast on successful login', async () => {
    mockLogin.mockResolvedValueOnce(true);
    
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome Back!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast on failed login', async () => {
    mockLogin.mockResolvedValueOnce(false);
    
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid Credentials');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('navigates to register page when sign up button is clicked', () => {
    render(<Login />);
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});