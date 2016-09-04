module.exports = {
    //source: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
    //secret: key for JWT
    'secret': 'tmenos3-revolutioningtheinovation',
    //'database': 'mongodb://noder:noderauth&54;proximus.modulusmongo.net:27017/so9pojyN'
    'database': 'http://localhost:9200',
    'expiresIn': 3600, //Time in seconds
    'port': 8080,
    'pathsWithoutAuthentication': ['/', 
                                   '/login', 
                                   '/signUp']
};