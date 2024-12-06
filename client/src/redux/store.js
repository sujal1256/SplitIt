import {configureStore} from '@reduxjs/toolkit';
import groupSlice from './group.slice.js'

const store = configureStore({
    reducer: {
        group: groupSlice
    }
});

export {store};