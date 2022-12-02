let express = require('express');
let app = express();
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8500;
let mongo=require('mongodb');
const { response, query } = require('express');
let MongoClient = mongo.MongoClient;
let mongoUrl=process.env.LiveMongo;
let db;
let bodyparser=require('body-parser');
const bodyParser = require('body-parser');
const e = require('express');
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyParser.json())


// 1)Create API for Restaurant search page with filters,sort and pagination as input parameters

//select  location dropdown
app.get('/location',(req,res)=>{
    db.collection('location').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//filter by cuisines checkboxs

app.get('/cuisines/:cuisineid',(req,res)=>{
    let cuisine=Number(req.params.cuisineid);
    let lcost=Number(req.query.lcost);
    let hcost=Number(req.query.hcost);
    let sort={cost:1};

    let query={};

//sort by price

    if(req.query.sort){
        sort={cost:req.query.sort}
    }

// filter by cost for two radio buttons

    if(lcost&&hcost)
    {
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}]}
    }

    else if(cuisine)
    {
        query={"Cuisine.cuisine":cuisine}
    }

    db.collection('restaurantdata').find(query).sort(sort).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})

//pagination for 2 restaurants in every page

app.get('/restaurants/',(req,res)=>{
    const page=Number(req.query.page);
    const limit=2;
    const skip=(page-1)*2;
    db.collection('restaurantdata').find().skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})


// 2)Create API for restaurants product details page

  //scenario 1

  app.get('/location/:city',(req,res)=>{
    let city_id=Number(req.params.city);
    let rest=req.query.restaurant;
    let query={};
    if(city_id&&rest)
    {
        query={city:city_id,name:rest}
    }
    db.collection('restaurantdata').find(query).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
  })


//scenario 2


app.get('/filter/:cuisineid',(req,res)=>{
    let cuisine=Number(req.params.cuisineid);
    let lcost=Number(req.query.lcost);
    let hcost=Number(req.query.hcost);
    let sort={cost:1};
    let city_id=Number(req.query.city);
    let rest=req.query.restaurant;

    let query={};

    if(req.query.sort){
        sort={cost:req.query.sort}
    }
    else if(lcost&&hcost&&city_id&&rest)
    {
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],city:city_id,name:rest}
    }

    else if(lcost&&hcost&&city_id)
    {
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],city:city_id}
    }

    else if(lcost&&hcost)
    {
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}]}
    }
    
    else if(cuisine)
    {
        query={"Cuisine.cuisine":cuisine}
    }
    else{
        query={}
    }
    
    db.collection('restaurantdata').find(query).sort(sort).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    })
})







MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log('Error while connecting');
    db = client.db('zomato');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })

})