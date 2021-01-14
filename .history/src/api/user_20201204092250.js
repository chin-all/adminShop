import axios from "./../utils/http"
import router from "@/router"
async function login(data){
    let res = await axios.post("/api/userlogin", data);
    console.log(res);
    if (res.code == 200){

    }
}