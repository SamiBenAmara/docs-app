import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import userReducer from './reduxSlices/userSlice';

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        userData: persistedReducer
    }
});

export const persistor = persistStore(store);

// export default persistStore = () => {
//     let store = configureStore(persistedReducer);
//     let persistor = persistStore(store);
//     return { store, persistor };
// };

// export default configureStore({
//     reducer: {
//         userData: userReducer,
//     },
// });