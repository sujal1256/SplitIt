import {createSlice} from '@reduxjs/toolkit';

const groupSlice = createSlice({
    name: "group",
    initialState: {
        group: null
    },
    reducers: {
        addGroup(state, action){
            state.group = action.payload;
        },
        removeGroup(state){
            state.group = null;
        }
    }
});
export const {addGroup, removeGroup} = groupSlice.actions;
export default groupSlice.reducer;