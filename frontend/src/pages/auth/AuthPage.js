import {SearchPage} from "../search/SearchPage.js";
import {RegPage} from "../reg/RegPage.js";
import {AuthCardComponent} from "../../components/auth/AuthCardComponent.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class AuthPage {
    constructor(parent) {
        this.parent = parent;
    }

    async getData() {
        return ajax.get(urls.stocks())
    }

    async postAuth(request) {
        return ajax.post(urls.auth(), request)
    }

    async goSearch(e) {
	const login = document.getElementById("login").value
	const pass = document.getElementById("password").value

//	const auth_string = {username: "nonpenguin", password: "777"}
	const auth_string = {username: login, password: pass}
	console.log( auth_string )
	const response = await this.postAuth(auth_string)
	console.log(response)

	if (!(response.status === "Success")) {
		console.log( 'error' )
		document.getElementById("alert-input").textContent = "Логин или пароль введены неверно"
		document.getElementById("alert-input").style.color = "red"
	}
	else {

//	const data = await this.getData() 
//	const data = {status: 404, next: null, data: {status: 404, results: []}}

//        const searchPage = new SearchPage(this.parent)
//        searchPage.render(data)

	window.location.href = "index"
	}
    }

    goReg(e) {
//        const regPage = new RegPage(this.parent)
//        regPage.render()

	window.location.href = "reg"
    }

    get page() {
        return document.getElementById('auth-page')
    }

    getHTML() {
        return (
            `
                <div id="auth-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

	const auth = new AuthCardComponent(this.page)
        auth.render(this.goSearch.bind(this), this.goReg.bind(this))
    }
}
