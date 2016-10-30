http://localhost:9200/yojuego/user/
PUT _mapping
{
    "user": {
        "properties": {
            "id": {
                "type": "string",
                "index": "not_analyzed"
            },
            "password": {
                "type": "string"
            },
            "type": {
                "type": "string",
                "index": "not_analyzed"
            }
        }
    }
}
      }

http://localhost:9200/yojuego/player/
PUT _mapping
{
    "player": {
        "properties": {
            "nickName": {
                "type": "string",
                "index": "not_analyzed"
            },
            "birthDate": {
                "type": "string"
            },
            "state": {
                "type": "string"
            },
            "adminState": {
                "type": "string"
            },
            "userid": {
                "type": "string",
                "index": "not_analyzed"
            }
        }
    }
}

http://localhost:9200/yojuego/match/
PUT _mapping
{
    "match": {
        "properties": {
            "title": { "type": "string" },
            "date": { "type": "date" },
            "fromTime": { "type": "string" },
            "toTime": { "type": "string" },
            "location": { "type": "string" },
            "matchType": { "type": "integer" },
            "creator": {
                "type": "string",
                "index": "not_analyzed"
            },
            "players" : {
                "properties" : {
                    "_id" : { "type" : "string"}
                }
            },
            "comments" : {
                "properties" : {
                    "id" : { "type" : "integer"},
                    "owner" : { "type" : "string"},
                    "text" : { "type" : "string"},
                    "writtenOn": { "type": "date" }
                }
            }
        }
    }
}