import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/Shell';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';
import DevTools, { setLogEnabled } from 'mobx-react-devtools';

/* STORES */
import UserStore from './Stores/UserStore.js';
import CollectionStore from './Stores/CollectionStore.js';
import QuestionStore from './Stores/QuestionStore.js';
import DemographicsDataStore from './Stores/DemographicsDataStore.js';
import CensusDataStore from './Stores/CensusDataStore.js';
import AppStatisticsStore from './Stores/AppStatisticsStore.js';

/* AXIOS CONFIG & MIDDLEWARE */
axios.defaults.baseURL = 'http://localhost:8000';
//SEE 'INTERCEPTORS' FOR MIDDLEWARE

injectTapEventPlugin();

window.stores = {
  UserStore:              new UserStore(),
  CollectionStore:        new CollectionStore(),
  QuestionStore:          new QuestionStore(),
  DemographicsDataStore:  new DemographicsDataStore(),
  CensusDataStore:        new CensusDataStore(),
  AppStatisticsStore:     new AppStatisticsStore(),
}

window.authSettings = {
  facebookPageId: 1522822621304793,
  facebookId: 1499361770335561,
}

setLogEnabled(false); // Mobx dev tools

//<DevTools />

ReactDOM.render(
  <div><Provider
    UserStore={window.stores.UserStore}
    CollectionStore={window.stores.CollectionStore}
    QuestionStore={window.stores.QuestionStore}
    DemographicsDataStore={window.stores.DemographicsDataStore}
    CensusDataStore={window.stores.CensusDataStore}
    AppStatisticsStore={window.stores.AppStatisticsStore}
  ><Shell/></Provider></div>,
  document.getElementById('root')
);
