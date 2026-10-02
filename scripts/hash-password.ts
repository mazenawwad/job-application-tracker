import bcrypt from "bcryptjs";

(async() =>{
  const hash1 = await bcrypt.hash("testpass", 12);
  
  console.log(hash1);
  
} )()