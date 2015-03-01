# fmh-server

### Install
0. `npm install`


### Modules & libs

#### Frontend
* http://jquery.com

#### Backend
* http://expressjs.com
* https://github.com/mongodb/node-mongodb-native


### Playback mode
1. `mongoexport -h ds049211.mongolab.com:49211 -d heroku_app34344665 -c hr -u <user> -p <password> -o hr.json`
2. Format into proper json (add commas and square brackets).
3. Place file in public/ folder.
4. Swap link to `hr-live.js` to `hr-playback.js` in `index.html`.