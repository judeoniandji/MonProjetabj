import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobsReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore ces actions pour la sérialisation
                ignoredActions: ['auth/loginSuccess', 'auth/logout'],
                // Ignore ces chemins dans le state
                ignoredPaths: ['auth.user']
            }
        })
});
