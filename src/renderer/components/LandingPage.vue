<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
        <div>
          <button @click="moveFiles()" :class="[CopyingState ? 'copying' : '', 'move-button']">Move Files <div id="nest5"></div></button>
        </div>
      </div>

      <div class="right-side">
        <div>
          <div class="title">Information</div>
          <div class="items">
            <div class="item">
              <div class="name">File Count:</div>
              <div class="value">{{ FileCount }}</div>
            </div>
            <div class="item">
              <div class="name">File Size:</div>
              <div class="value">{{ FileSize }}</div>
            </div>
            <div id="folders" v-if="CameraFolders != null && CameraFolders.length > 0">
              <div class="item-vert">
                <div class="name">SELECT FOLDER:</div>
                <div class="value">
                  <ul id="folder-selector">
                    <li v-for="item in CameraFolders" v-bind:key="item">
                      <label class="checkbox-container">
                        {{item}}
                        <input type="checkbox" :name="item" :value="item" @change="updateSelected()">
                        <span class="checkmark"></span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="CameraFolders == null && CameraFolders.length == 0">
              <div class="item">
                <div class="name">DCIM Folder:</div>
                <div class="value">{{ CameraCardLocation }}</div>
              </div>
            </div>
            <div :class="[DestinationFolder === 'NOT FOUND' ? 'item' : 'item-vert']">
              <div class="name">Destination:</div>
              <div class="value">{{ DestinationFolder }}</div>
            </div>
            <div class="item">
              <div class="name" v-if="ErrorMessage.length > 0">Error:</div>
              <div class="value">{{ ErrorMessage }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="file-name">
      {{FileBeingMoved}}
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" :class="ProgressBarClass" :style="{'width': CopyPercentage + '%'}"></div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';
import Vue from 'vue';
import { mapState, mapActions } from "vuex";
import actions from '../store/actions'

export default {
  name: "copier",
  computed: mapState(["FileCount", "FileSize", "FileBeingMoved", "CopyPercentage", "ProgressBarClass", "CameraCardLocation", "DestinationFolder", "ErrorMessage", "CameraFolders", "CopyingState"]),
  methods: {
    moveFiles() {
      remote.app.copier.copyFiles();
    },
    updateSelected() {
      let selectedFolders = [];
      //Reset all of the file counts to 0
      this.$store.dispatch(actions.RESET_FILES);
      //Go through each folder and add it to the collection to search
      document.querySelectorAll('#folder-selector input:checked').forEach(element => selectedFolders.push(element.value));
      //Update our store.
      this.$store.dispatch(actions.SET_SELECTED_CAMERA_FOLDERS, selectedFolders);
      //Go through each folder in the collection and search for the files and tally them up.
      selectedFolders.forEach(folder => remote.app.copier.loadFiles(folder));
    },
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(0, 0, 0, 1) 40%,
    rgba(33, 33, 33, 0.9) 100%
  );
  height: 100vh;
  padding: 10px 10px;
  width: 100vw;
  font-size: 14px;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 100%;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.right-side { 
  padding: 0 1em 0 2em;
}

.items { 
  display: flexbox;
}

.items .item {
  display: flex;
  justify-content: space-between;
  margin: 0 0 .5em 0;
}

.welcome {
  color: #555;
  font-size: 16px;
  margin-bottom: 10px;
}

.title {
  color: #ddd;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
}

.name {
  color: #c60073;
  font-weight: bold;
}

.value {
  color: #ddd;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.progress-bar {
  background: #f63a0f;
  width: 1%;
  height: 16px;
  border-radius: 4px;
	background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: -o-linear-gradient(top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  -webkit-transition: 0.4s linear;
  -moz-transition: 0.4s linear;
  -o-transition: 0.4s linear;
  transition: 0.4s linear;
  -webkit-transition-property: width, background-color;
  -moz-transition-property: width, background-color;
  -o-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
}

.progress-bar.twentyfive {
  background: #f27011;
}

.progress-bar.fifty {
  background: #f2b01e;
}

.progress-bar.seventyfive {
  background: #f2d31b;
}

.progress-bar.onehundred {
  background: #86e01e;
}

.progress-bar-container {
  width: 95%;
  margin: 5px auto 0;
  padding: 4px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

button.move-button {
  font-size: 1.2em;
  cursor: pointer;
  outline: none;
  padding: 1em 3em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #ff0077;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #ff0077;
  margin-bottom: 1em;
  position: relative;
}

#folder-selector {
  list-style: none;
}

#folder-selector li {
  padding: .25em 0 .25em;
}

.checkbox-container {
  display: block;
  position: relative;
  padding: 5px 0 0 35px;
  cursor: pointer;
  height: 25px;
  font-size: .85em;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #ff0077;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 9px;
  top: 3px;
  width: 5px;
  height: 13px;
  border: solid white;
  border-width: 0 3px 3px 0;
  border-radius: 4px;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.file-name
{
  height: 25px;
  width: 95%;
  margin: 2em auto 1em;
  color: #bbb;
  margin-top: 10px;
  padding: 5px;
  text-align: center;
  border-radius: 6px;
  background: #222;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
}

button.move-button.copying {
  background: #000;
  border-color: #ff0077;
}

#nest5 {
  display: none;
  position: absolute;
  top: 50%;
  right: .5em;
  height: 2em;
  width: 2em;
  margin: -1em 0 0 0;
  border: 2px solid transparent;
  border-top-color: #0097cf;
  border-radius: 50%;
  -webkit-animation: spin11 2s linear infinite;
          animation: spin11 2s linear infinite;
}

button.move-button.copying #nest5 {
  display: block;
}

#nest5:before {
  content: "";
  position: absolute;
  top: 7px;
  right: 7px;
  bottom: 7px;
  left: 7px;
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: #fff200;
  -webkit-animation: spin11 3s linear infinite;
          animation: spin11 3s linear infinite;
}

@-webkit-keyframes spin11 {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}
@keyframes spin11 {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}

</style>
