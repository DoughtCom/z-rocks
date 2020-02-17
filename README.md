# z-rocks

> A photo copier electronjs app made specifically for the RPi (4) to copy files off of an SD Card onto a backup drive.

The logo was inspired by my favorite childhood radio station [99.1 Z-Rock](https://youtu.be/XFLIf1OFHXM?t=120) and the name works as a pun to the company that invented the mouse that made photo copiers.

<img width="490" src="/docs/Screenshot-V.01.png" alt="electron-vue">

# z-rocks Notes

#### Dev Installation and Deployment
- npm install (if you're using windows do this from the windows powershell NOT WSL's bash)
- npm run dev (to test code/runtime)
- Install WSL if you do not have this installed, you need a linux runtime to build for raspbian
  - Install Ubuntu and open up bash
- npm run build:rpi (to build the deb file for raspbian) from the bash in your ubuntu WSL 
- Make sure you're in the root directory of the code, where the package.json is.
- scp ./build/z-rocks_0.1.0_armv7l.deb pi@192.168.1.124:~/z-rocks_0.1.0_armv7l.deb

#### Setup Raspberry Pi
- Install Raspbian to SD Card using etcher
- Follow instructions online for headless setup to get ssh working and to get it on wifi (if you do not have ethernet to utilize) 
- Install z-rocks
- First time installing z-rocks you need to run the deb file from the GUI in raspbian for some reason cli does not work, *after this time however you can utilize the following command from bash*
  - sudo dpkg -i ~/z-rocks_0.1.0_armv7l.deb
- sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
  - Add line: z-rocks
  - close and save
- sudo reboot (at this point if you've done all of the above it should autostart on boot)

#### 3D Model
- [z-rocks case viewable model](https://myhub.autodesk360.com/ue29781b4/g/shares/SH919a0QTf3c32634dcff0055839dc1213d1?viewState=NoIgbgDAdAjCA0IDeAdEAXAngBwKZoC40ARXAZwEsBzAOzXjQEMyzd1C0YATCADgE4ATABYIAWgBmMQRLHCJAVkZiARv14LJAdggA2RluExGjYcLQBfEAF0gA)

- [z-rocks case download](https://www.thingiverse.com/thing:4167374)

---

# Notes from electron-vue

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

#### Credits

- This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). 
- Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
- 3D Case was started by [CSD Salzburg](https://www.thingiverse.com/thing:1895374) and modified by me for the RPi 4 with some adjustments for this project.