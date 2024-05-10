const fs = require('fs');
const path = require('path');

const { Client } = require('@elastic/elasticsearch')

const client = new Client({
    node: 'http://localhost:9200/'
  })

const express = require('express');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

app.use("/data",express.static('data'));

app.use("/",express.static('html'));

app.listen(8080, () => {
    console.log("Server Listening on PORT:", 8080);
  });

app.post("/index", async (request, response) => {
    const status = {
        index : await elasticIndex()
    };
     
    response.send(status);
});

async function elasticIndex() 
{ 
    try
    {
        await client.indices.delete({index: 'index'});
    }
    catch(err)
    {
        console.log("Index does not exist");
    }
    await client.indices.create({index: 'index'});
    let bro = 0;
    const files = await fs.promises.readdir( "data" );
    for( const file of files )
    {
        const contents = fs.readFileSync(path.join("data",file), { encoding: 'utf8' });
        const date = fs.statSync(path.join("data",file)).mtime;
        console.log(date);
        await client.index({
            index: 'index',
            body: {
              title: file,
              body: contents,
              modification_date: date
            }
    }
    );
    bro++;
    }
    return bro;
}

app.post("/search", jsonParser, async (request, response) => {
    const { term, field, page } = request.body;
    const results = await searchX(term, field, page);
    response.send(results);
});

async function searchX(term, field, page)
{
    const { body } = await client.search({
        index: 'index',
        body: {
          query: {
            match: {
              [field]: term
            }
          }
        },
        from : page*5,
        size : 5
      }
      )
    console.log(body.hits.hits);
    return {hits : body.hits.total.value, results : body.hits.hits.map(a => a._source)};
}