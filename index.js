const express = require('express')
const connectDB = require('./config/db')
const app = express()
const PORT = 5000 || process.env.PORT
const router = express.Router();
const path = require('path')
const cors = require('cors')
connectDB()


const Layout = require('express-ejs-layouts')
require('ejs')

const methodOverride = require('method-override')
const blog = require('./Models/blog');
const navbat = require('./Models/navbat');
app.use(methodOverride('_method', {
     methods: ["POST", "GET"]
}))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(Layout)

    
app.use('/assets', express.static(path.join(__dirname, 'Public/assets')))
app.use('/plugins', express.static(path.join(__dirname, 'Public/plugins')))
app.use('/uploads', express.static(path.join(__dirname, 'Public/uploads')))

app.use(cors())
app.use(express.json(), express.urlencoded({ extended: true }))
// for read json 
console.log(__dirname);
// app.use(require('./Route/booksRoute'))
// app.use(require('./Route/categoryRoute'))
// app.use(require("./Route/institutRoute"))
// app.use(require('./Route/userRoute'))
// app.use(require('./Route/dashboardRoute'))
// app.use(require('./Rsoute/requestRoute'))
// app.use(require('./Route/guruhRoute'))
// app.use(require("./Route/otmdashboard"))
// app.use(require('./Route/adminRoute'))
// app.use(require("./Route/vazirlikRoute"))
// app.use(require("./Route/errorRoute"))
// app.use(require('./Route/institutAdminRoute'))



// Function to calculate the time difference in hours
const getHoursDifference = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
  };
  
  app.get('/filterServices', async (req, res) => {
    try {
      const services = await navbat.find(); // Fetch all services
      const currentTime = new Date(); // Current time
  
      // Initialize an empty array to store filtered services
      const filteredServices = [];
  
      // Filter services based on the 32-hour condition
      services.forEach(service => {
        const serviceDate = new Date(service.serviceDate);
        const hoursDifference = getHoursDifference(currentTime, serviceDate);
  
        if (hoursDifference <= 32) {
          filteredServices.push(service); // Push service to the array if within 32 hours
        }
           console.log(service);
      });

   
      // Respond with the filtered services
      res.json({ success: true, filteredServices });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

app.use(require('./Route/navbatROute'))
app.use(require('./Route/messageRoute'))
app.use((require("./Route/dashboardRoute")))
app.use((require("./Route/blogRoute")))

app.listen(PORT, () => {
    console.log(`Sever is running at ${PORT} port`)
})
