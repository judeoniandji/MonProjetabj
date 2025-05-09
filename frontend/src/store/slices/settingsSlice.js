import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../../services/api';

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getSettings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'settings/updateNotificationSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateNotifications(settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePrivacySettings = createAsyncThunk(
  'settings/updatePrivacySettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await settingsService.updatePrivacy(settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  settings: {
    notifications: {
      email_notifications: true,
      job_alerts: true,
      event_reminders: true,
    },
    privacy: {
      profile_visibility: 'public',
      show_email: false,
      show_connections: true,
    },
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur lors du chargement des paramètres';
      })
      // Update Notification Settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings.notifications = action.payload.settings;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur lors de la mise à jour des paramètres de notification';
      })
      // Update Privacy Settings
      .addCase(updatePrivacySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings.privacy = action.payload.settings;
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur lors de la mise à jour des paramètres de confidentialité';
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer; 