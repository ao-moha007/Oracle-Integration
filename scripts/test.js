const  dotenv = require("dotenv");
dotenv.config();
function main() {
   console.log("Test : ",process.env.ACCESSKEY);
}
main();