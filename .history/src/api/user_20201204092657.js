import axios from "./../utils/http"
import router from "@/router"
import { MessageBox } from 'element-ui';

async function login(data){
    let res = await axios.post("/api/userlogin", data);
    console.log(res);
    if (res.code == 200){
        localStorage.setItem("token", res.list.token);
        router.replace("/");
    } else {
        MessageBox.error(res.msg);
    }
}

export {login}