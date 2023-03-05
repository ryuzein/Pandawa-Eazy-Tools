package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/radenrishwan/otakudesu-api/scrape"
	"github.com/radenrishwan/otakudesu-api/utils"
)

func main() {
	r := mux.NewRouter()

	r.Use(utils.ErrorHandler)

	r.HandleFunc("/api/home", scrape.HomePage).Methods("GET")
	r.HandleFunc("/api/anime-list", scrape.AnimeList).Methods("GET")
	r.HandleFunc("/api/genres", scrape.AnimeGenreList).Methods("GET")
	r.HandleFunc("/api/anime/ongoing", scrape.AnimeOnGoing).Methods("GET")
	r.HandleFunc("/api/anime/complete", scrape.AnimeComplete).Methods("GET")
	r.HandleFunc("/api/anime/genre/{genre}", scrape.AnimeFindByGenre).Methods("GET")
	r.HandleFunc("/api/anime/{id}", scrape.AnimeDetail).Methods("GET")
	r.HandleFunc("/api/episode/{id}", scrape.EpisodeDetail).Methods("GET")
	r.HandleFunc("/api/search", scrape.FindAnime).Methods("GET")

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		result := map[string]any{
			"message": "Hi, Welcome to Unofficial Otakudesu API 🐔",
			"author":  "seior",
			"github":  "https://github.com/radenrishwan/otakudesu-api",
		}

		bytes, err := json.Marshal(utils.DefaultResponse[any]{
			Code: 200,
			Data: result,
		})
		utils.PanicIfError(err)

		utils.NewSuccessResponse(string(bytes), w, r)
	})

	log.Fatalln(http.ListenAndServe(":8080", r))
}
