crypto = require("crypto");
const randomKey = async () => {
    const buffer = await crypto.randomBytes(48);
    return buffer.toString("hex");
  };
  


  randomKey().then((hash)=>{
      console.log(hash)
  })