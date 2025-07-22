/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/register';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';
import '@testing-library/jest-dom/vitest';

// Mock dependencies
vi.mock('react-router-dom');
vi.mock('react-hot-toast');
vi.mock('../services/api');

describe('Register Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mocks
    (useNavigate as any).mockReturnValue(mockNavigate);
    (registerUser as any).mockResolvedValue(true);
  });

  it('renders register form correctly', () => {
    render(<Register />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates form values on input change', () => {
    render(<Register />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(usernameInput).toHaveValue('johndoe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('validates password length', async () => {
    render(<Register />);
    const passwordInput = screen.getByLabelText(/^password/i);
    
    // Test short password
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'short' } });
    await waitFor(() => {
      expect(screen.getByText(/password must be between 8 and 20 characters/i)).toBeInTheDocument();
    });
    
    // Test valid password
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'validpassword123' } });
    await waitFor(() => {
      expect(screen.queryByText(/password must be between 8 and 20 characters/i)).not.toBeInTheDocument();
    });
  });

  it('validates password confirmation match', async () => {
    render(<Register />);
    
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    // Set password
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    
    // Set non-matching confirmation
    fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'different123' } });
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    
    // Set matching confirmation
    fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'password123' } });
    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    });
  });

  it('prevents form submission when passwords do not match', async () => {
    render(<Register />);
    
    // Fill out form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { name: 'firstname', value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { name: 'username', value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'different123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Passwords dont match');
      expect(registerUser).not.toHaveBeenCalled();
    });
  });

  it('shows loading state during registration process', async () => {
    // Make registerUser function delay to show loading state
    (registerUser as any).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    
    render(<Register />);
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { name: 'firstname', value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { name: 'username', value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/creating account/i)).not.toBeInTheDocument();
    });
  });

  it('navigates to login page and shows success toast on successful registration', async () => {
    (registerUser as any).mockResolvedValueOnce(true);
    
    render(<Register />);
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { name: 'firstname', value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { name: 'username', value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration Successful');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error toast on failed registration', async () => {
    (registerUser as any).mockResolvedValueOnce(false);
    
    render(<Register />);
    
    // Fill out form with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { name: 'firstname', value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { name: 'lastname', value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { name: 'username', value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'password123' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Registration Failed :(');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('navigates to login page when login button is clicked', () => {
    render(<Register />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});