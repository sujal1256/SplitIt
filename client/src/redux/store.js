import {configureStore} from '@reduxjs/toolkit';
import groupSlice from './group.slice.js'
import userSlice from './user.slice.js'

const store = configureStore({
    reducer: {
        group: groupSlice,
        user: userSlice
    }
});

export {store};