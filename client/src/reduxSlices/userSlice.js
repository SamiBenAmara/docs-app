import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userData',
    initialState: {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        isLoggedIn: false
    },
    reducers: {
        updateAllData: (state, action) => {
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        updateFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        updateLastName: (state, action) => {
            state.lastName = action.payload;
        },
        updateUserName: (state, action) => {
            state.userName = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updateLoggedInStatus: (state, action) => {
            state.isLoggedIn = action.payload
        },
        resetUserData: (state, action) => {
            state.firstName = '';
            state.lastName =  '';
            state.userName = '';
            state.email = '';
            state.isLoggedIn = false;
        }
    }
});

export const { updateFirstName, updateLastName, updateUserName, updateEmail, updateAllData, updateLoggedInStatus, resetUserData } = userSlice.actions;

export default userSlice.reducer;