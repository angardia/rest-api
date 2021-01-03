const { fstat } = require("fs");
const http = require("http");
const url = require("url");
const fs = require("fs");


//on every refresh
http.createServer((req, res) => {
    if (req.method === "POST" && req.url.includes("/user")) {
        const query = url.parse(req.url, true).query;

        //reading file
        readFile((users) => {
            //my evil deeds ^^
            if(users.findIndex(user => user.userName === query.username) === -1){
            //saving to array
            users.push({ "userName": query.username, "password": query.password });
            //saving file 
            saveFile(users, () => {
                res.write(`user ${query.username} created `);
                res.write(` password is ${query.password}`);
                res.end();
            });
            }
            else{
                res.write(`user ${query.username} already exist`)
                res.end();
            }
        });
        



    } else if (req.method === "GET" && req.url.includes('/user')) {
        readFile((users) => {
            res.write(JSON.stringify(users));
            res.end();
        })
    }
    else if (req.method === "DELETE" && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {
            const newArr = users.filter(user => user.userName !== query.username);
            if (newArr.length !==users.length) {
                saveFile(newArr, () => {
                    res.write(`user ${query.username} was deleted`)
                    res.end();
                })
            }
            else{
                res.write(`user ${query.username} doesn't exist`)
                res.end();
            }

        })
    }
    else if (req.method === "PUT" && req.url.includes('/user')) {
        const query = url.parse(req.url, true).query;
        readFile((users) => {
            const index = users.findIndex(user => user.userName === query.username);
            if (index !== -1) {
                users[index].userName = query.newUsername;
                saveFile(users, () => {
                    res.write(`user ${query.username} was updated`)
                    res.end();
                })
            }
            else{
                res.write(`user ${query.username} doesn't exist`)
                res.end();
            }

        })
    }
}).listen(4000);

//file to create -> what to save (content) ->  what to do when process is finished(cb)
function saveFile(content, cb) {
    fs.writeFile("./src/db.json", JSON.stringify(content), cb);
}

function readFile(cb) {
    fs.readFile("./src/db.json", "utf8", (err, content) => {
        cb(JSON.parse(content));
    });
}

console.log("listening on http://localhost:4000");
