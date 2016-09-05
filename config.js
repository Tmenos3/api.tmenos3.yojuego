module.exports = {
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