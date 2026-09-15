import bcrypt from "bcryptjs";

(async() =>{
  const hash1 = await bcrypt.hash("pass1", 12);
  const hash2 = await bcrypt.hash("pass2", 12);
  
  console.log(hash1);
  console.log(hash2);
  
} )()