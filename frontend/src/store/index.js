import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import eventsReducer from './slices/eventsSlice';
import messagesReducer from './slices/messagesSlice';
import profileReducer from './slices/profileSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    events: eventsReducer,
    messages: messagesReducer,
    profile: profileReducer,
    settings: settingsReducer,
  },
}); 