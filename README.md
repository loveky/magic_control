# Magic Control
Control your PC with your SmartPhone

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
