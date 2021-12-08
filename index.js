const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()
const port = process.env.PORT || 5000
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(port, () => console.log(`server running on ${port}`)))
    .catch(err => console.log(err))

app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/carts", require("./routes/cartRoute"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/checkout", require("./routes/stripeRoute"));