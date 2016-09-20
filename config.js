module.exports = {
    facebook: {
        appId: '1278813425492876',
        appSecret: '9c4337094d1d9b3f732396f3540b15d5',
        callback: 'http://localhost:8080/signup/facebook/callback'
    },
    google: {
        appId: '854114285051-7pi1os5u7bifv8i8ed5vbfjlpkg9ulea.apps.googleusercontent.com',
        appSecret: 'YNWKX6gPs8UTUpjXMe7c2reX',
        callback: 'http://localhost:8080/signup/google/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    'database': 'http://localhost:9200',
    'expiresIn': 86400, //Time in seconds
    'port': 8080,
    'pathsWithoutAuthentication': ['/',
        '/echo',
        '/signup/facebook/callback',
        '/signup/google/callback',
        '/signup/yojuego',
        '/signup/facebook',
        '/signup/google',
        '/login/facebook/callback',
        '/login/google/callback',
        '/login/yojuego',
        '/login/facebook',
        '/login/google']
};