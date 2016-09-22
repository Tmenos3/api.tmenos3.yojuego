module.exports = {
    facebook: {
        appId: '1278813425492876',
        appSecret: '9c4337094d1d9b3f732396f3540b15d5',
        callback: 'http://localhost:8080/signup/facebook/callback'
    },
    google: {
        appId: '854114285051-7pi1os5u7bifv8i8ed5vbfjlpkg9ulea.apps.googleusercontent.com',
        appSecret: 'YNWKX6gPs8UTUpjXMe7c2reX',
        callback: 'http://localhost:8080/auth/google/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    'database': 'https://search-yojuegoes-cb2mgiednpd4tf5epwebnbszfe.us-east-1.es.amazonaws.com/',
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