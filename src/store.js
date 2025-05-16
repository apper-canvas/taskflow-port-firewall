import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './features/taskSlice';
import userReducer from './store/userSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    user: userReducer
  }
});

export default store;
