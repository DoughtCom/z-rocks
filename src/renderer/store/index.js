import Vue from 'vue'
import Vuex from 'vuex'
import types from './actions'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const state = {
  CurrentFileIndex: 1,
  CameraCardLocation: '',
  FileCount: 0,
  FileSize: 0,
  FileBeingMoved: '',
  CopyPercentage: 0,
  ProgressBarClass: '',
  DestinationFolder: '',
  ErrorMessage: '',
  CameraFolders: '',
  SelectedCameraFolders: [],
  CopyingState: false,
}

const mutations = {
  //Used to reset the File Size/Count every time we select a folder.
  resetFiles(state) {
    state.FileCount = 0;
    state.FileSize = 0;
  },
  //Used to reset the rest of the store's state.
  resetState(state) {
    state.CurrentFileIndex = 0;
    state.CameraCardLocation = '';
    state.FileCount = 0;
    state.FileSize = 0;
    state.FileBeingMoved = '';
    state.CopyPercentage = 0;
    state.ProgressBarClass = '';
    state.DestinationFolder = '';
    state.ErrorMessage = '';
    state.CameraFolders = [];
    state.SelectedCameraFolders = [];
    state.CopyingState = false;
  },
  incrementCurrentFileIndex (state) {    
    state.CurrentFileIndex++;
    
    //Let's increment the % so that we have the new value to add to the store and use below.
    let copyPercentage = Math.round(state.CurrentFileIndex / state.FileCount * 100);
    state.CopyPercentage = copyPercentage

    //If we've reached the end of the line, reset the button's style.
    if (state.CurrentFileIndex === state.FileCount)
    {
      state.CopyingState = false;
    }

    //Todo: Rework this so it's more dynamic/programmatic.
    if (copyPercentage >= 95)
    {
      state.ProgressBarClass = 'onehundred';
    }
    else if (copyPercentage >= 75)
    {
      state.ProgressBarClass = 'seventyfive';
    }
    else if (copyPercentage >= 50)
    {
      state.ProgressBarClass = 'fifty';
    }
    else if (copyPercentage >= 25)
    {
      state.ProgressBarClass = 'twentyfive';
    }
  },
  setFileCount (state, payload) {
    state.FileCount += payload;
  },
  setFileSize (state, payload) {
    //"Cast" it back to a number since we're saving it as a string as a fixed decimal.
    let castedSize = state.FileSize * 1;

    state.FileSize = (castedSize + payload * 1).toFixed(2);
  },
  setFileBeingMoved (state, fileName) {
    state.FileBeingMoved = fileName;
  },
  setDestinationFolder (state, destination) {
    state.DestinationFolder = destination;
  },
  setCameraCardLocation (state, cardLocation) {
    state.CameraCardLocation = cardLocation;
  },
  setError (state, errorMessage) {
    state.ErrorMessage = errorMessage;
  },
  setCameraFolders (state, cameraFolders) {
    state.CameraFolders = cameraFolders;
  },
  setSelectedCameraFolders (state, selectedFolders) {
    state.SelectedCameraFolders = selectedFolders;
  },
  setCopyingState (state, copying) {
    state.CopyingState = copying;
  }
}

const actions = {
  resetFiles: ({ commit }) => { 
    return new Promise((resolve, reject) => {
      commit(types.RESET_FILES);
      resolve();
    });
  },
  resetState: ({ commit }) => commit(types.RESET_STATE),
  incrementCurrentFileIndex: ({ commit }) => commit(types.INCREMENT_CURRENT_FILE_INDEX),
  setFileCount: ({ commit }, fileCount) => commit(types.SET_FILE_COUNT, fileCount),
  setFileSize: ({ commit }, fileSize) => commit(types.SET_FILE_SIZE, fileSize),
  setFileBeingMoved: ({ commit }, fileName) => commit(types.SET_FILE_BEING_MOVED, fileName),
  setDestinationFolder: ({ commit }, destination) => commit(types.SET_DESTINATION_FOLDER, destination),
  setCameraCardLocation: ({ commit }, cameracard) => commit(types.SET_CAMERA_CARD_LOCATION, cameracard),
  setError: ({ commit }, errorMessage) => commit(types.SET_ERROR_MESSAGE, errorMessage),
  setCameraFolders: ({ commit }, cameraCards) => commit(types.SET_CAMERA_FOLDERS, cameraCards),
  setSelectedCameraFolders: ({ commit }, selectedFolders) => commit(types.SET_SELECTED_CAMERA_FOLDERS, selectedFolders),
  setCopyingState: ({ commit }, copying) => commit(types.SET_COPYING_STATE, copying),
  enableFileMove: ({ commit }) => commit(types.ENABLE_FILE_MOVE),
}

const getters = {

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
