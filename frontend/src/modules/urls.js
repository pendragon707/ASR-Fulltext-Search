class Urls {
    constructor() {
        this.url = 'http://localhost:8000/';
    }

    stocks() {
        return `${this.url}search/`
    }

    stock(id) {
        return `${this.url}search/${id}/`
    }
}

export const urls = new Urls()
