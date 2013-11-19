#Orchastrator

Synchronize browser state. Currently implemented are scroll location and URL.

##State

This product is in an early stage, expect everything to change.


##Installation and first steps

```bash
#install dependencies
npm install

#make a user
node tools/createUser.js admin holySecret 1

#run the server
node .
```

Then navigate to http://localhost:3000 and login with the user you just created. Go to http://localhost:3000/test.html. Then do the same in another browser or window and enjoy the synchronization.

##Demo

[![Orchestrator demo](http://img.youtube.com/vi/OxLSHA86M3s/0.jpg)](http://www.youtube.com/watch?v=OxLSHA86M3s&fmt=22)
