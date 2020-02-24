import axios from 'axios';


let axiosConfig = { headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Access-Control-Allow-Origin': '*'
                    }
                  }

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;
axios.defaults.axiosConfig = axiosConfig;

export default axios;