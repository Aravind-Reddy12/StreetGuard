
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Streetguard = require('../models/streetguard');

mongoose.connect('mongodb://127.0.0.1:27017/street-guard')
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log("oh no error")
        console.log(err)
    });

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Streetguard.deleteMany({});
    for (let i = 0; i < 60; i++){
        const random1000 = Math.floor(Math.random() * 60);
        const issue = new Streetguard({
            author: '652c08fa067f3f0de7ca13a0',
            adminId:'653de89ee48491d90d3029f1',//added admin for the seeds
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
             images: [
                    {
                    url: 'https://res.cloudinary.com/dvyolwnhx/image/upload/v1697472622/Streetguard/wxp4n8kprtmfj3bphesn.jpg',
                    filename: 'Streetguard/wxp4n8kprtmfj3bphesn',
                    
                    }
                    // {
                    // url: 'https://res.cloudinary.com/dvyolwnhx/image/upload/v1697472623/Streetguard/e8yryflhe9j42o7jgc9s.png',
                    // filename: 'Streetguard/e8yryflhe9j42o7jgc9s',
                    
                    // }
                ],

            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo ratione sed perspiciatis quo odio illum architecto, sint cum ea nostrum nemo deleniti soluta repellat itaque vel ut labore, deserunt hic?"
        })
        await issue.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
})