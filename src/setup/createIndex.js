http://localhost:9200/yojuego/user/
GET _mapping
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
                "type": "string"
            }
        }
    }
}
      }

http://localhost:9200/yojuego/player/
GET _mapping
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