const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

///// Files ///////////////////////////////////////////////////////

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {

//         console.log("this first dadt2: " + data2);
//         fs.readFile('./txt/append4.txt', 'utf-8', (err, data3) => {

//             if (err) {
//                 return console.log('ERROR! 🤯🤢');
//             } else {

//                 console.log("data3 " + data3);
//             }

//             fs.writeFile('./txt/final.txt', `data2: ${data2} \n data3: ${data3}`, 'utf-8', err => {
//                 if (err) {
//                     return console.log('ERROR! 🤯🤢');
//                 } else {

//                     console.log("finished writing 😆");
//                 }

//             })
//         });
//     });
// });
// console.log("sync ");

// const textOut = `This is what we know about the Avocado: ${textIn}.\nCreated on ${Date(Date.now()).toString()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File was written!');
// const readTextOut = fs.readFileSync('./txt/output.txt', 'utf-8');
// console.log(readTextOut);

///// Server ///////////////////////////////////////////////////////


const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);


const server = http.createServer((req, res) => {


    const { query, pathname } = url.parse(req.url, true);

    // Overview Page////////////////////////////

    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

        // Product Page /////////////////////////////
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // API /////////////////////////////
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        // Not Found Page /////////////////////////////
    } else {

        res.writeHead(404, {

            'content-type': 'text/html',
            'my-own-header': 'hello-world'

        });
        res.end('<h1 style="color:purple;">You asked the WRONG page ASSHOLE!</h1>\n<img src="https://images.unsplash.com/photo-1521996319423-90475f382dff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60">');
    }

});

server.listen(8000, '127.0.0.1', () => console.log('Lisetning to requests on port 8000'));

