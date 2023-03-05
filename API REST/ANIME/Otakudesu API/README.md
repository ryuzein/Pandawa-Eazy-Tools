# Otakudesu API
an Unofficial API for [otakudesu](https://otakudesu.video)

you can access demo here [https://otakudesu-api-psezlumomq-as.a.run.app](https://otakudesu-api-psezlumomq-as.a.run.app) (this is temporary url).
## Usage
### NOTE
before running server, you need to export otakudesu endpoint. you can see at .env file for command or type command below
```bash
export ENDPOINT=PUT-OTAKUDESU-ENDPOINT
```
### Run from Source Code
1. Clone the repository
```bash
git clone https://github.com/radenrishwan/otakudesu-api
```
2. Run Server
```bash
go run main.go
```
3. Build 

    you can also build from source code and run

    ```bash
    go build -o main
    ```

    and run using
    
    ```bash
    ./main
    ```

### Build using Docker

1. Clone the repository
```bash
git clone https://github.com/radenrishwan/otakudesu-api
```

2. Build docker image
```bash
docker build -t otakudesu-api:1.3.1 . 
```
or you can also pull from dockerhub
```
docker pull radenrishwan/otakudesu-api:1.3.1
```

3. Create container and run
```
docker run -it -p 8080:8080 -e ENDPOINT='https://otakudesu.video/' radenrishwan/otakudesu-api:1.2.0
```

### Using docker compose
you can also running using docker compose 
1. Change endpoint variable on docker-compose.yml file
2. Run command below
```bash
docker-copomse up -d
```

## API Docs
endpoint : https://otakudesu-api-psezlumomq-as.a.run.app/

| endpoint                 | params | description                               |
| ------------------------ | ------ | ----------------------------------------- |
| /                        | -      | health check                              |
| /api/home                | -      | get latest upload anime                   |
| /api/anime-list          | -      | get anime list                            |
| /api/genres              | -      | get anime genre                           |
| /api/anime/ongoing       | page   | get ongoing anime                         |
| /api/anime/complete      | page   | get complete anime                        |
| /api/anime/genre/{genre} | -      | get anime by genre                        |
| /api/anime/{id}          | -      | get anime by id                           |
| /api/episode/{id}        | -      | get anime episode and download link by id |
| /api/search              | s      | find anime                                |

params description :
- s
    - description : search query
    - data type: string
    - example : `api/search?s=one piece` 
- page
    - description : page number
    - data type: int
    - example : `api/anime/ongoing?page=1`


## TODO
1. add more endpoint
2. add error response when params is not valid ✅
3. create a demo app ✅
    here is app example using this api : [https://github.com/radenrishwan/otakudesu-app](https://github.com/radenrishwan/otakudesu-app) (Deprecated)
5. create api docs ✅
