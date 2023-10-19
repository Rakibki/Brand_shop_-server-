const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const productsCollection = database.collection("productsCollection");
    const myCard = database.collection("myCard")

    app.get('/TrendingProducts', async  (req, res) => {
        const corsue = TrendingProducts.find();
        const result = await corsue.toArray()
        res.send(result)
    })
	
	app.post("/products", async (req, res) => {
		const product = req.body;
		const result = await productsCollection.insertOne(product);
		res.send(result)
		console.log(product)
	})

	app.get("/products/:name", async (req, res) => {
		const {name} = req.params
		const result = await productsCollection.find({BrandName: name}).toArray();
		res.send(result)
	})

	app.get("/product/:id", async(req, res) => {
		 const id = req.params.id
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        res.send(result)

	})

  app.post("/myProducts", async(req, res) => {
		const product = req.body;
		const result = await myCard.insertOne(product);
		res.send(result)
	})

  app.get('/myProducts', async(req, res) => {
    const corsue = myCard.find();
    const result = await corsue.toArray()
    res.send(result)
 })


 app.delete("/myProducts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id : id};
  const result = await myCard.deleteOne(query);
  res.send(result)
 }) 


  app.put("/products/:id", async(req, res) => {
    const id = req.params.id
    const product = req.body
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };

    const newProduct = {
      $set: {
        name: product.Name,
        BrandName: product.BrandName,
        Category: product.Category,
        Price: product.Price,
        Rating: product.Rating,
        ShortDescription: product.ShortDescription,
        image: product.image,
      },
    };
    const result = await productsCollection.updateOne(filter, newProduct, options);
    res.send(result)
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