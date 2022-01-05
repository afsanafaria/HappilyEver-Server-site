const express = require('express');
require('dotenv').config()
 
const { MongoClient } = require('mongodb');    
const cors = require('cors');                 
const ObjectId = require('mongodb').ObjectId;
 
 
const app = express();  
const port = process.env.PORT || 5000;      

 
app.use(cors());     
app.use(express.json());
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1isfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('profiles_listing');   
    const profilesCollection = database.collection('profiles');


      //POST API
      app.post('/profiles', async (req, res) => {
        const newProfile = req.body;
        const result = await profilesCollection.insertOne(newProfile)
        console.log('got new Profile', req.body);
        console.log('added a new Profile', result);
        res.json(result)
    })

     //GET API
     app.get('/profiles', async (req, res) => {
        const cursor = profilesCollection.find({});   
        const profiles = await cursor.toArray();    
        res.send(profiles);
    })

    //UPDATE STATUS
    app.put('/profiles/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProfile = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              Status: updatedProfile.Status,
          },
      };
      const result = await profilesCollection.updateOne(filter, updateDoc, options)
      console.log("updated this order status", result);
      res.json(result)
  })



    //GET API BY ONE
    app.get('/profiles/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const profile = await profilesCollection.findOne(query);

      console.log("load profile with id:", id)
      res.send(profile);
  })

      //DELETE API
      app.delete('/profiles/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await profilesCollection.deleteOne(query);
        console.log('deleting the user having this unique', result)
        // res.send("going to delete")
        res.json(result);
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {  
    res.send("Running my CRUD server")   
})
 
app.listen(port, () => {
    console.log("Running server on the port", port); 
})


// profilesListing
// sSVv505wCZJGabeM

