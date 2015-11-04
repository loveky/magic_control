# Magic Control
Control your PC with your SmartPhone

### This is built on
<img src="http://electron.atom.io/images/electron-logo.svg" height="43">       
<img src="http://cdn.socket.io/website/imgs/logo.svg" height="43">       
<img src="https://camo.githubusercontent.com/ab0771e05fd85f2c4c7ceaf490055d8b0e4b4deb/68747470733a2f2f636c6475702e636f6d2f3141544466324a4d74762e706e67" height="35">    

### Development
I'm using `node 4.2.1` & `npm 3.x`

Step1 Clone this repo to you local disk.

Step2 Install dependencies
```bash
cd magic_control
npm install

cd app
npm install
```
_Note: make sure you have the [required dependencies](https://github.com/octalmage/robotjs#installation)  before installing `robotjs`_

Step3 Rebuild electron to make it works with robotjs.
```bash
cd app/
.\node_modules\.bin\electron-rebuild.cmd
```

Step 4 Enjoy the development!
