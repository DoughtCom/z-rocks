# Dev Installation and Deployment
- npm install
- npm run dev (to test code)
- Install WSL if you do not have this installed, you need a linux runtime to build for raspbian
- - Install Ubuntu and open up bash
- npm run build:rpi (to build the deb file for raspbian) from the bash in your ubuntu WSL 
- Make sure you're in the root directory of the code, where the package.json is.
- scp ./build/z-rocks_0.1.0_armv7l.deb pi@192.168.1.124:~/z-rocks_0.1.0_armv7l.deb
- ssh to the raspberry pi
- run this inside the bash on the pi: sudo dpkg -i ~/z-rocks_0.1.0_armv7l.deb

---
#### Setup Raspberry Pi
- Install Raspbian to SD Card using etcher 
- sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
- - Add line: z-rocks
- - close and save
- sudo reboot (at this point if you've done all of the above it should autostart on boot)