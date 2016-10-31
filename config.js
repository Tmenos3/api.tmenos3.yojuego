module.exports = {
    facebook: {
        appId: '289976541370822',
        appSecret: 'c619851f38a6d9bfb1d6d2a208ee6bc0',
        callback: 'http://ec2-54-174-177-82.compute-1.amazonaws.com:8081/signup/facebook/callback'
    },
    google: {
        appId: '854114285051-7pi1os5u7bifv8i8ed5vbfjlpkg9ulea.apps.googleusercontent.com',
        appSecret: 'YNWKX6gPs8UTUpjXMe7c2reX',
        callback: 'http://ec2-54-174-177-82.compute-1.amazonaws.com:8081/auth/google/callback'
        //callback: 'http://localhost:8080/auth/google/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    //'database': 'https://search-yojuegoes-cb2mgiednpd4tf5epwebnbszfe.us-east-1.es.amazonaws.com/',
    'database': 'http://127.0.0.1:9200/',
    'expiresIn': 86400, //Time in seconds
    'port': 8081,
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