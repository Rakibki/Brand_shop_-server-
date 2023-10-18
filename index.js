const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Home Route")
})


const uri = "mongodb+srv://Brand-Shop-project:Xu4cUQklKMQo0bDO@cluster0.sinogwr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db("BrandShopDB");
    const TrendingProducts = database.collection("TrendingProducts");
    const AddProducts = database.collection("AddProducts");


    app.get('/TrendingProducts', async  (req, res) => {
        const corsue = TrendingProducts.find();
        const result = await corsue.toArray()
        res.send(result)
    })
	
	app.post("/products", async (req, res) => {
		const product = req.body;
		const result = await AddProducts.insertOne(product);
		res.send(result)
		console.log(product)
	})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(PORT, () => {
    console.log("server is Running");
})