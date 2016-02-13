import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueStrap from 'vue-strap';

Vue.config.debug = true;
Vue.use(VueResource);
//Vue.use(VueRouter);
Vue.use(VueStrap);

import HomeComponent from './components/home/Home';

let app = new Vue({
    el: '#app',
    components: {
        "app-component": HomeComponent
    },
    http: {
        root: '/api',
        headers: {
            Authorization: 'Basic YXBpOnBhc3N3b3Jk'
        },
        options: {
            emulateJSON: true,
            emulateHTTP: true
        }
    }
});
