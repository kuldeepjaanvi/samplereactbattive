import axios from 'axios';

import * as c from './constants';
import data from './ecoach.json'
import db from '@react-native-firebase/database';

import fb  from "firebase";

var firebaseConfig = {
        apiKey: "AIzaSyDfAp832VywNandGGnq9WdsK2oqs73tnTc",
        authDomain: "pari-f7c41.firebaseapp.com",
        databaseURL: "https://pari-f7c41.firebaseio.com",
        projectId: "pari-f7c41",
        storageBucket: "pari-f7c41.appspot.com",
        messagingSenderId: "671977645802",
        appId: "1:671977645802:web:03ce4e52e97d3655511993",
        measurementId: "G-4G48CNFPBR"
      };

export async function getHeadlines(country = "us"){
    try{
        // let requests = [];
        // c.CATEGORIES.map((category) => {
        //     let url =  `${c.HEADLINES}&country=${country}&category=${category.toLowerCase()}`;
        //     requests.push(axios.get(url))
        // });

        // let response = await Promise.all(requests);
        // response.map((resp, idx) => {
        //     let {articles, totalResults} = resp.data;

        //     response[idx] = {articles, totalResults};
        // });
        var response;
        if (!fb.apps.length) {
            fb.initializeApp(firebaseConfig);
        }
        const db = fb.database();
        await db.ref('/')
        .once('value')
        .then(snapshot => {
          console.log('User data: ', snapshot.val());
          let items = snapshot.val()
          response = {...items}
        });
        // db.ref('/').on('value', querySnapShot => {
        //     let data = querySnapShot.val() ? querySnapShot.val() : {};

        //     // let {articles, totalResults} = data;
        //     // response = {articles, totalResults}
        //   });
        let {articles, totalResults} = {...response};

       // response[0] = {articles, totalResults};
        let [technology] = [{articles, totalResults}];

        return {technology};

    }catch (e) {
        throw new Error(e);
    }
}

export async function getHeadlinesByCategory(category, page=1, country = "us"){
    try{
        const url = `${c.HEADLINES}&category=${category}&page=${page}&country=${country}`;
        let res = await axios.get(url);

        return res.data;
    }catch (e) {
        throw new Error(e);
    }
}

export async function search(query, cancelToken){
    try{
        const url = `${c.SEARCH}&q=${query.toLowerCase()}`;
        let res = await axios.get(url, {
            cancelToken: cancelToken.token,
        });

        return res.data;

    }catch (error) {
        let err = new Error(error.message);
        err.isCancel = (axios.isCancel(error));

        throw err;
    }
}