package utils

import (
	"fmt"
	"net/http"
)

type DefaultResponse[T any] struct {
	Code int `json:"code"`
	Data T   `json:"data"`
}

type HomePageResponse struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	Thumbnail string `json:"thumbnail"`
	Url       string `json:"url"`
	Episode   string `json:"episode"`
}

type HomeResponse struct {
	Ongoing  []HomePageResponse `json:"ongoing"`
	Complete []HomePageResponse `json:"complete"`
}

type AnimeListResponse struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Url   string `json:"url"`
}

type AnimeDetailResponse struct {
	Id            string               `json:"id"`
	Title         string               `json:"title"`
	Thumbnail     string               `json:"thumbnail"`
	JapaneseTitle string               `json:"japanese_title"`
	Score         string               `json:"score"`
	Producer      string               `json:"producer"`
	Type          string               `json:"type"`
	Status        string               `json:"status"`
	Duration      string               `json:"duration"`
	ReleaseDate   string               `json:"release_date"`
	Studio        string               `json:"studio"`
	Genre         string               `jsFon:"genre"`
	Synopsis      string               `json:"synopsis"`
	Episode       []AnimeDetailEpisode `json:"episode"`
}

type AnimeDetailEpisode struct {
	Id         string `json:"id"`
	Episode    string `json:"episode"`
	Url        string `json:"url"`
	UploadDate string `json:"upload_date"`
}

type EpisodeDetail struct {
	Id           string    `json:"id"`
	Title        string    `json:"title"`
	DownloadUrls []UrlInfo `json:"download_urls"`
	StreamUrl    string    `json:"stream_url"`
}

type UrlInfo struct {
	Host       string `json:"host"`
	Url        string `json:"url"`
	Size       string `json:"size"`
	Resolution string `json:"resolution"`
}

type FindAnimeResponse struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	Thumbnail string `json:"thumbnail"`
	Url       string `json:"url"`
}

type FindAnimeByGenreResponse struct {
	Id        string   `json:"id"`
	Title     string   `json:"title"`
	Thumbnail string   `json:"thumbnail"`
	Episode   string   `json:"episode"`
	Genre     []string `json:"genre"`
	Url       string   `json:"url"`
	Score     string   `json:"score"`
}

// NewSuccessResponse create new response when success
func NewSuccessResponse(resp string, w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)

	_, err := fmt.Fprint(w, resp)
	PanicIfError(err)
}

// NewCustomResponse with custom status code
func NewCustomResponse(resp string, code int, w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(code)

	_, err := fmt.Fprint(w, resp)
	PanicIfError(err)
}
