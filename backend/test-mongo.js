// Simple MongoDB test script
const mongoose = require("mongoose");

async function testConnection() {
  const mongoUri = process.env.MONGO_URI || "mongodb+srv://dhanrajsingh:dhanraj10@cluster0.xsembmw.mongodb.net/?appName=Cluster0";
  
  console.log("Testing MongoDB connection...");
  console.log("Using URI:", mongoUri.replace(/\/\/(.*?):(.*?)@/, "//****:****@"));
  
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("✅ Connection successful!");
    console.log("Host:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
    
    // Try a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log("✅ Test completed successfully");
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    if (error.code) console.error("Code:", error.code);
  }
}

testConnection();