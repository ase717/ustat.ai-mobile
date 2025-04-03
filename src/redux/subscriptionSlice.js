import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  packages: [],
  userSubscription: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    fetchPackagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPackagesSuccess: (state, action) => {
      state.packages = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPackagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserSubscriptionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSubscriptionSuccess: (state, action) => {
      state.userSubscription = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserSubscriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUserSubscription: (state) => {
      state.userSubscription = null;
    },
  },
});

export const {
  fetchPackagesStart,
  fetchPackagesSuccess,
  fetchPackagesFailure,
  fetchUserSubscriptionStart,
  fetchUserSubscriptionSuccess,
  fetchUserSubscriptionFailure,
  clearUserSubscription,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 