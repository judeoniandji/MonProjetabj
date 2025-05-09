import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      console.log('Réponse de connexion:', response.data);
      
      // Vérifier si la réponse est au format attendu
      if (response.data && response.data.success === true && response.data.data) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', response.data.data.token);
        return response.data.data;
      } else {
        // Gérer le cas où la réponse est au format incorrect
        return rejectWithValue(response.data.error || 'Format de réponse incorrect');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Gérer les erreurs de manière plus robuste
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || 'Identifiants invalides');
      } else {
        return rejectWithValue(error.message || 'Erreur réseau');
      }
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      console.log('Réponse d\'inscription:', response.data);
      
      // Vérifier si la réponse est au format attendu
      if (response.data && response.data.success === true && response.data.data) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', response.data.data.token);
        return response.data.data;
      } else {
        // Gérer le cas où la réponse est au format incorrect
        return rejectWithValue(response.data.error || 'Format de réponse incorrect');
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      // Gérer les erreurs de manière plus robuste
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.error || 'Erreur d\'inscription');
      } else {
        return rejectWithValue(error.message || 'Erreur réseau');
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Erreur lors de l\'envoi du lien' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Erreur lors de la déconnexion' });
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur de connexion';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur d\'inscription';
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur lors de l\'envoi du lien';
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Erreur lors de la réinitialisation du mot de passe';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload?.error || 'Erreur lors de la déconnexion';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;