module.exports = {
    facebook: {
        appId: '289976541370822',
        appSecret: 'c619851f38a6d9bfb1d6d2a208ee6bc0',
        callback: 'http://ec2-54-174-177-82.compute-1.amazonaws.com:8081/signup/facebook/callback'
    },
    'secret': 'tmenos3-revolutioningtheinovation',
    'database': 'http://localhost:9200',
    'expiresIn': 3600, //Time in seconds
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