import {Bulb} from './bulb';
import {printHelp, processArgs} from './config';
import {StatusChecks} from './status-checks';
import {Observable} from '@reactivex/rxjs';
import * as path from 'path';

import {initializeApp, database} from 'firebase';

const argv = processArgs(process.argv.slice(2));

if (argv.help) {
  printHelp();
  process.exit(0);
}

let status = new StatusChecks();
if (argv.statusCheck) {
  status.runCheck(argv.statusCheck);
  let timer = Observable.interval(100);
  timer.timestamp().subscribe((e) => {
    console.log(e);
  });
  //process.exit(1);
}

const FIREBASE_AUTH_PATH = '../protractor-status-light-00feae863d91.json';
initializeApp({
  databaseURL: "https://protractor-status-light.firebaseio.com",
  serviceAccount: path.resolve(process.cwd(), FIREBASE_AUTH_PATH)
});

let db = database();
let ref = db.ref('disco');

let bulb = new Bulb();

bulb.init().then(() => {
  bulb.setDefaultColor({white: 0xaf});
  ref.child('manual').on('value', (snapshot) => {
    console.log("New value:", snapshot.val());
    bulb.controlLight(snapshot.val());
  });
  /*
  Observable.interval(5000)
      .forEach(() => {
        bulb.pulse();
      });
      */
});