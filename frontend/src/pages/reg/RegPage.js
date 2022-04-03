import {SearchPage} from "../search/SearchPage.js";
import {AuthPage} from "../auth/AuthPage.js";
import {RegCardComponent} from "../../components/reg/RegCardComponent.js";
import {BackButtonComponent} from "../../components/back-button/BackButton.js";
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";

export class RegPage {
    constructor(parent) {
        this.parent = parent;
    }

//    async getData() {
//        return ajax.get(urls.stocks())
//    }

    async postReg(request) {
        return ajax.post(urls.reg(), request)
    }

    clickBack() {
//        const authPage = new AuthPage(this.parent)
//        authPage.render()
	
	window.location.href = "auth"
     }

    async goAuth(e) {
	const login = document.getElementById("login").value
	const pass = document.getElementById("password").value
	const pass_confirm = document.getElementById("password-confirm").value
	
	if (!(pass === pass_confirm)) {
		document.getElementById("alert-input").textContent = "Пароль и подтверждение не совпадают"
		document.getElementById("alert-input").style.color = "red"
	}
	else {
		const reg_string = {username: login, password: pass, files: []}
		console.log( reg_string )
		const response = await this.postReg(reg_string)
		console.log(response)
	
		if (response.status === "Exist") {
			document.getElementById("alert-input").textContent = "Пользователь с таким именем уже существует"
			document.getElementById("alert-input").style.color = "red"
		}
		else if (!(response.status === "Success")) {
			document.getElementById("alert-input").textContent = "Ошибка в заполнении полей"
			document.getElementById("alert-input").style.color = "red"
		}
		else {
	//        	const authPage = new AuthPage(this.parent)
	//        	authPage.render()

			window.location.href = "auth"
	
		//	const data = await this.getData() 
	//	const data = {status: 404, data: {status: 404, results: []}}
	
	//        	const searchPage = new SearchPage(this.parent)
	//        	searchPage.render(data)
	
		}
	}
    }

    get page() {
        return document.getElementById('reg-page')
    }

    getHTML() {
        return (
            `
                <div id="reg-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

	const backButton = new BackButtonComponent(this.page)
        backButton.render(this.clickBack.bind(this))

	const reg = new RegCardComponent(this.page)
        reg.render(this.goAuth.bind(this))
    }
}
