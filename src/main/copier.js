import { app } from 'electron';
import path from 'path';
import actions from '../renderer/store/actions'
import getSize from 'get-folder-size';

import fs from 'fs';
const dateformat = require('dateformat');

//Todo: Have the system search under /media/pi for the DCIM folder, for now every disk has to be named "DISK"
let cameraCard = '/media/pi/DISK/DCIM';
let cameraFolders = [];
let destination = '/media/pi/Image\ Dump';
let now = new Date();
const copyFolder = '!SD_Backup_' + dateformat(now, 'mm-dd-yy_HH-MM');
let destinationFolder = path.join(destination, copyFolder);

class Copier {
    constructor(app) {
        this.app = app;
        //if the system is in development mode make sure you have c:\DCIM_Test and c:\DCIM_Dest with some test files in DCIM_Test
        if (process.env.NODE_ENV === 'development')
        {
            cameraCard = 'C:\\DCIM_Test';
            destination = 'C:\\DCIM_Dest';
            destinationFolder = path.join(destination, copyFolder);
            app.store.dispatch(actions.RESET_FILES);
        }
    }

    //This fires on application start to do the work of finding all of the folders the system needs. 
    loadStore() {
        app.store.dispatch(actions.RESET_STATE);

        //Todo: Rewrite this messy code with regex and the ability to find any folder inside the DCIM folder
        if (fs.existsSync(path.join(cameraCard, '101ND750')))
        {
            app.store.dispatch(actions.SET_CAMERA_CARD_LOCATION, '101ND750');
            cameraFolders.push(path.join(cameraCard, '101ND750'));
        }
        if (fs.existsSync(path.join(cameraCard, '101ND800')))
        {
            app.store.dispatch(actions.SET_CAMERA_CARD_LOCATION, '101ND800');
            cameraFolders.push(path.join(cameraCard, '101ND800'));
        }
        if (fs.existsSync(path.join(cameraCard, '101ND850')))
        {
            app.store.dispatch(actions.SET_CAMERA_CARD_LOCATION, '101ND850');
            cameraFolders.push(path.join(cameraCard, '101ND850'));
        }
        if (fs.existsSync(path.join(cameraCard, '101GOPRO')))
        {
            app.store.dispatch(actions.SET_CAMERA_CARD_LOCATION, '101GOPRO');
            cameraFolders.push(path.join(cameraCard, '101GOPRO'));
        }
        else {
            app.store.dispatch(actions.SET_CAMERA_CARD_LOCATION, 'NOT FOUND');
        }

        app.store.dispatch(actions.SET_CAMERA_FOLDERS, cameraFolders);

        if (fs.existsSync(destination))
        {
            app.store.dispatch(actions.SET_DESTINATION_FOLDER, destination);
        }
        else
        {
            app.store.dispatch(actions.SET_DESTINATION_FOLDER, 'NOT FOUND');
        }

        if (cameraFolders.length == 0)
        {
            this.loadFiles(cameraFolders[0]);
        }
    }

    //This loads the files in each folder that the person selects they want to copy.
    loadFiles(cameraFolder) {
        if (fs.existsSync(cameraFolder)) {
            let files  = fs.readdirSync(cameraFolder);
            let fileNames = files
                .filter(fileName => fs.lstatSync(path.join(cameraFolder, fileName)).isFile());

            app.store.dispatch(actions.SET_FILE_COUNT, fileNames.length);

            getSize(cameraFolder, (err, size) => {
                app.store.dispatch(actions.SET_FILE_SIZE, (size / 1024 / 1024).toFixed(2));
            });
        }
    }

    //This copies the files from the folders in the array of folders the person selected to copy.
    copyFiles() {
        try {
            if (fs.existsSync(destination) && app.store.state.SelectedCameraFolders.length > 0) {
                //Make the directory we set above.
                fs.mkdirSync(destinationFolder);
    
                //Set the state to copying so they can't double press the button and so that vue knows to set the button class.
                app.store.dispatch(actions.SET_COPYING_STATE, true);

                //Go through each folder that the person has selected and start copying files.
                app.store.state.SelectedCameraFolders.forEach(cameraFolder => {
                    let files  = fs.readdirSync(cameraFolder);
                    //Only grab files, ignore folders. 
                    //Todo: Perhaps in the future we may want to only grab NEFs or JPGs ... oorrrr let the user decide. 
                    let fileNames = files
                        .filter(fileName => fs.lstatSync(path.join(cameraFolder, fileName)).isFile());

                    fileNames.forEach(file => {
                        fs.copyFile(path.join(cameraFolder, file), path.join(destinationFolder, file), (err) => {
                            //If for whatever reason we get an error, dispatch it so that the vue component can show the user.
                            if (err) {
                                app.store.dispatch(actions.SET_ERROR_MESSAGE, err); 
                            }
        
                            //Update the store with the current file and then increment the file index.
                            app.store.dispatch(actions.SET_FILE_BEING_MOVED, path.join(cameraFolder, file));
                            app.store.dispatch(actions.INCREMENT_CURRENT_FILE_INDEX);    
                        });
                    });
                });
            }
        } catch (error) {
            //If for whatever reason we get an error, dispatch it so that the vue component can show the user.
            app.store.dispatch(actions.SET_ERROR_MESSAGE, error);
            //Reset the state to not copying.
            app.store.dispatch(actions.SET_COPYING_STATE, false);
        }
    }
}

export default Copier;