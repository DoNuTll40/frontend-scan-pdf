
import axios from "axios";

const ipAddress = window.location.hostname;

axios.defaults.baseURL = `http://${ipAddress}:8080`;

export default axios;