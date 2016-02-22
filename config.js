if(process.env.NODE_ENV ==='production'){
    module.exports = {
        consumer_key: 'KmnaM1BkofM0iiqaTzDmoSXSn',
        consumer_secret: 'x8ZgwWOL2nObd78VmDptaHag2T8f09fUy5aB3rxzc4EqjlPhTk',
        access_token: '14613610-Td3X1f8zMAihYTjueJ8aS1t1LMatyx4fq30AbjLl0',
        access_token_secret: '6Snbh8yz9m7bvh5FHyLPmSUGnBpV08NiUpe6MpIsxvljr',
        callbackURL: 'http://seat-tweet.herokuapp.com//api/login_cb'
    };
}
else{
    module.exports = {
        consumer_key: 'KmnaM1BkofM0iiqaTzDmoSXSn',
        consumer_secret: 'x8ZgwWOL2nObd78VmDptaHag2T8f09fUy5aB3rxzc4EqjlPhTk',
        access_token: '14613610-Td3X1f8zMAihYTjueJ8aS1t1LMatyx4fq30AbjLl0',
        access_token_secret: '6Snbh8yz9m7bvh5FHyLPmSUGnBpV08NiUpe6MpIsxvljr',
        callbackURL: 'http://127.0.0.1:3000/api/login_cb'
    };
    
}