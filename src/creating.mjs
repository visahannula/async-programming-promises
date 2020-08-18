import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!");
        }, 1000);
    });

    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log("Interval fired.");
            resolve(`Timeout! ${++counter}`);
        }, 1000);
    });

    wait.then(text => setText(text))
        .finally(() => {
            appendText(`Finally! ${counter}`);
        });
}

export function clearIntervalChain() {
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log("Interval fired.");
            resolve(`Timeout! ${++counter}`);
        }, 1000);
    });

    wait.then(text => setText(text))
        .finally(() => {
            clearInterval(interval);
        });
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/users/7");
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(`Error, request status: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => reject("Request failed.");
        xhr.send();
    });

    request
        .then((response) => setText(response))
        .catch((errtext) => {
            console.log(errtext);
            setText(errtext);
        });
}

export function allPromises() {
    let categories = axios.get("/itemCategories");
    let statuses = axios.get("/orderStatuses");
    let userTypes = axios.get("/userTypes");
    let bogus = axios.get("/bogus");

    Promise.all([categories, statuses, userTypes, bogus])
        .then(([categories, statuses, userTypes, bogus]) => {
            [categories, statuses, userTypes, bogus].forEach(item => 
                appendText(JSON.stringify(item.data)));
        })
        .catch(reasons => {
            setText(reasons);
        });
}

export function allSettled() {
    let categories = axios.get("/itemCategories");
    let statuses = axios.get("/orderStatuses");
    let userTypes = axios.get("/userTypes");
    let bogus = axios.get("/bogus");

    Promise.allSettled([categories, statuses, userTypes, bogus])
        .then(values => {
            let responses = values.map(v => {
                if (v.status === 'fulfilled') {
                    return `Fullfilled: ${JSON.stringify(v.value.data[0])}`;
                }

                return `Rejected: ${v.reason.message}`;
            });

            setText(responses);
        })
        .catch(reasons => {
            setText(reasons);
        });
}

export function race() {
    /* WARNING This should be tied to your dev env IP */
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise
        .race([users, backup])
        .then((userlist) => setText(JSON.stringify(userlist.data)))
        .catch(reason => setText(`Cannot get users. ${reason}`));
}