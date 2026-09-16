import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Shared UI/Theme Slice - For GLOBAL UI STATE
 * This manages UI state that affects the entire application:
 * - Theme (light/dark mode)
 * - Sidebar state
 * - Global modals
 * - Notifications
 */

export interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) return stored;
  }
  return 'dark'; // Default to dark as requested
};

const initialState: UiState = {
  sidebarOpen: true,
  theme: getInitialTheme(),
  notificationsEnabled: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
  setNotificationsEnabled,
} = uiSlice.actions;

// Export reducer
export const uiReducer = uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state: { ui: UiState }) =>
  state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectNotificationsEnabled = (state: { ui: UiState }) =>
  state.ui.notificationsEnabled;
