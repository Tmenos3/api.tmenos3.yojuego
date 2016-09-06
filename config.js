module.exports = {
    facebook: {
        appId: '1278813425492876',
        appSecret: '9c4337094d1d9b3f732396f3540b15d5',
        callback: 'http://192.168.0.13:8080/login/facebook/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    'database': 'http://localhost:9200',
    'expiresIn': 3600, //Time in seconds
    'port': 8080,
    'pathsWithoutAuthentication': ['/', 
                                   '/signUp/facebook/callback', 
                                   '/signUp/google/callback',
                                   '/signUp/local',
                                   '/signUp/facebook',
                                   '/signUp/google',
                                   '/logIn/facebook/callback',
                                   '/logIn/google/callback',
                                   '/logIn/local',
                                   '/logIn/facebook',
                                   '/logIn/google']
};