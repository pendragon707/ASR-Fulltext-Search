import {SearchPage} from "./pages/search/SearchPage.js";
// import {AuthPage} from "./pages/auth/AuthPage.js";

import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

const root = document.getElementById('root');

// const authPage = new AuthPage(root)
// authPage.render()


// const auth_string = {username: "nonpenguin", password: "777"}
// const response = await ajax.post(urls.auth(), auth_string)


const searchPage = new SearchPage(root)
// searchPage.render({status: 404, data: {status: 404, results: []}})
// const data = await ajax.get(urls.stocks())
const data = {status: 404, data: {status: 404, results: []}} 
searchPage.render(data, 0)
