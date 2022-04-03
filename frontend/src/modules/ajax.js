class Ajax {
    async get(url) {
//	const auth ="Basic " + btoa("nonpenguin" + ":" + "777")
        const response = await fetch(url, {
            method: "GET",
	    mode: 'cors', 
            cache: 'no-cache', 
//            credentials: 'same-origin', 
	    credentials: 'include',
            headers: 
		{
              	'Content-Type': 'application/json',
	    	},
            redirect: 'follow', 
            referrerPolicy: 'no-referrer'
        });
        return await response.json(); 
//        const responseData = await response.json();
//
//        return {
//            status: response.status,
//            data: responseData
//        };
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: "POST", 
            mode: 'cors', 
            cache: 'no-cache', 
	    credentials: 'include',
//            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data) 
          });
          return await response.json(); 
        }

    async post_scribe(url, data) {
        const response = await fetch(url, {
            method: "POST", 
            mode: 'cors', 
            cache: 'no-cache', 
//	    credentials: 'include',
            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data) 
          });
          return await response.json(); 
        }

    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH', 
            mode: 'cors', 
            cache: 'no-cache', 
	    credentials: 'include',
//            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify(data) 
          });
          return await response.json(); 
	}

    async deleteD(url) {
        await fetch(url, {
            method: 'DELETE', 
            mode: 'cors', 
            cache: 'no-cache', 
	    credentials: 'include',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer'
          });
        }
}

export const ajax = new Ajax();
