module.exports = {
    facebook: {
        appId: '1278813425492876',
        appSecret: '9c4337094d1d9b3f732396f3540b15d5',
        callback: 'http://localhost:8080/signup/facebook/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    'database': 'http://localhost:9200',
    'expiresIn': 86400, //Time in seconds
    'port': 8080,
    'pathsWithoutAuthentication': ['/',
        '/echo',
        '/signup/yojuego',
        '/login/yojuego',
        '/auth/facebook/callback',
        '/auth/google/callback',
        '/auth/facebook',
        '/auth/google']
};