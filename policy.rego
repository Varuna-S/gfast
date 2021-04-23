package policy

default allow = false

allow{
	input.method == "POST"
    startswith(input.api, "/api/games")
    token.payload.isAdmin == true
}

allow{
	input.method == "PUT"
    startswith(input.api, "/api/games")
    token.payload.isAdmin == true
}

allow{
	input.method == "PATCH"
    startswith(input.api, "/api/games")
    token.payload.isAdmin == true
}

allow{
	input.method == "DELETE"
    startswith(input.api, "/api/games")
    token.payload.isAdmin == true
}

allow{
	input.method == "GET"
    startswith(input.api, "/api/games")
    token.payload.isAdmin == true
}

allow{
	input.method == "GET"
    input.api == "/api/users"
    token.payload.isAdmin == true
}

token = { "payload" : payload}{
[header, payload, signature] := io.jwt.decode(input.jwt)
}