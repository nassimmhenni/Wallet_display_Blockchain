const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nassimmhenni19:nassimmhenni19@cluster0.htfchnp.mongodb.net/')
    .then(
        ()=>{
            console.log('connected');
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
    )
module.exports = mongoose;





