package scrape

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gorilla/mux"
	"github.com/radenrishwan/otakudesu-api/utils"
)

var (
	ENDPOINT = os.Getenv("ENDPOINT")
)

func HomePage(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(ENDPOINT)
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []utils.HomePageResponse
	document.Find(".detpost").Each(func(i int, selection *goquery.Selection) {
		var anime utils.HomePageResponse

		anime.Episode = selection.Find(".epz").Text()
		anime.Url = selection.Find(".thumb a").AttrOr("href", "")
		anime.Thumbnail = selection.Find(".thumb a .thumbz img").AttrOr("src", "")
		anime.Title = selection.Find(".thumb a .thumbz h2").Text()

		// get anime id
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		result = append(result, anime)
	})

	ongoing := result[0 : (len(result)-1)/2]
	complete := result[(len(result)-1)/2 : len(result)-1]

	bytes, err := json.Marshal(utils.DefaultResponse[utils.HomeResponse]{
		Code: 200,
		Data: utils.HomeResponse{
			Complete: complete,
			Ongoing:  ongoing,
		},
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(bytes), w, r)
}

func AnimeList(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(ENDPOINT + "anime-list")
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []utils.AnimeListResponse
	document.Find("ul li .hodebgst").Each(func(i int, selection *goquery.Selection) {
		var anime utils.AnimeListResponse

		anime.Title = selection.Text()
		anime.Url = selection.AttrOr("href", "")

		// get anime id
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		result = append(result, anime)
	})

	bytes, err := json.Marshal(utils.DefaultResponse[[]utils.AnimeListResponse]{
		Code: 200,
		Data: result,
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(bytes), w, r)
}

func AnimeDetail(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	resp, err := http.Get(ENDPOINT + "anime/" + params["id"])
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result utils.AnimeDetailResponse
	root := document.Find(".fotoanime")

	result.Thumbnail = root.Find("img").AttrOr("src", "")
	result.Id = params["id"]
	root.Find(".infozin .infozingle p span").Each(func(i int, s *goquery.Selection) {
		switch i {
		case 0:
			result.Title = utils.GetDetailInfo(s.Text())
		case 1:
			result.JapaneseTitle = utils.GetDetailInfo(s.Text())
		case 2:
			result.Score = utils.GetDetailInfo(s.Text())
		case 3:
			result.Producer = utils.GetDetailInfo(s.Text())
		case 4:
			result.Type = utils.GetDetailInfo(s.Text())
		case 5:
			result.Status = utils.GetDetailInfo(s.Text())
		case 7:
			result.Duration = utils.GetDetailInfo(s.Text())
		case 8:
			result.ReleaseDate = utils.GetDetailInfo(s.Text())
		case 9:
			result.Studio = utils.GetDetailInfo(s.Text())
		case 10:
			result.Genre = utils.GetDetailInfo(s.Text())
		}
	})

	var synopsis []string
	root.Find(".sinopc p").Each(func(i int, s *goquery.Selection) {
		synopsis = append(synopsis, s.Text())
	})
	result.Synopsis = strings.Join(synopsis, "")

	var episodes []utils.AnimeDetailEpisode
	document.Find(".venser .episodelist ul li").Each(func(i int, s *goquery.Selection) {
		var episode utils.AnimeDetailEpisode

		episode.Episode = s.Find("span a").Text()
		episode.Url = s.Find("span a").AttrOr("href", "")
		episode.UploadDate = s.Find(".zeebr").Text()

		// get episode id
		d := strings.Split(episode.Url, "/")
		episode.Id = d[4]

		episodes = append(episodes, episode)
	})
	result.Episode = episodes

	if result.Title == "" {
		bytes, err := json.Marshal(utils.DefaultResponse[string]{
			Code: 404,
			Data: "Anime Not Found",
		})

		utils.PanicIfError(err)

		utils.NewCustomResponse(string(bytes), 404, w, r)
	} else {
		bytes, err := json.Marshal(utils.DefaultResponse[utils.AnimeDetailResponse]{
			Code: 200,
			Data: result,
		})
		utils.PanicIfError(err)

		utils.NewSuccessResponse(string(bytes), w, r)
	}
}

func EpisodeDetail(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	resp, err := http.Get(ENDPOINT + "episode/" + params["id"])
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result utils.EpisodeDetail
	root := document.Find(".venser .venutama")
	result.Id = params["id"]
	result.Title = root.Find("h1").Text()

	var urls []utils.UrlInfo
	root.Find(".download ul li").Each(func(i int, s *goquery.Selection) {
		var url utils.UrlInfo
		url.Resolution = s.Find("strong").Text()

		s.Find("a").Each(func(i int, se *goquery.Selection) {
			url.Url = se.AttrOr("href", "")
			url.Host = se.Text()

			url.Size = s.Find("i").Text()

			urls = append(urls, url)
		})

	})
	result.DownloadUrls = urls

	// find streaming url
	result.StreamUrl = root.Find("iframe").AttrOr("src", "")

	if result.DownloadUrls == nil {
		bytes, err := json.Marshal(utils.DefaultResponse[string]{
			Code: 404,
			Data: "Episode Not Found",
		})

		utils.PanicIfError(err)

		utils.NewCustomResponse(string(bytes), 404, w, r)
	} else {
		bytes, err := json.Marshal(utils.DefaultResponse[utils.EpisodeDetail]{
			Code: 200,
			Data: result,
		})
		utils.PanicIfError(err)

		utils.NewSuccessResponse(string(bytes), w, r)
	}
}

func FindAnime(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("s")

	url := fmt.Sprintf("%s?s=%s&post_type=anime", ENDPOINT, search)
	resp, err := http.Get(url)
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []utils.FindAnimeResponse
	document.Find(".page .chivsrc li").Each(func(i int, s *goquery.Selection) {
		var anime utils.FindAnimeResponse

		anime.Thumbnail = s.Find("img").AttrOr("src", "")
		anime.Title = s.Find("h2 a").Text()
		anime.Url = s.Find("h2 a").AttrOr("href", "")

		// get anime id
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		result = append(result, anime)
	})

	if len(result) < 1 {
		bytes, err := json.Marshal(utils.DefaultResponse[string]{
			Code: 404,
			Data: "Anime Not Found",
		})

		utils.PanicIfError(err)

		utils.NewCustomResponse(string(bytes), 404, w, r)
	} else {
		bytes, err := json.Marshal(utils.DefaultResponse[[]utils.FindAnimeResponse]{
			Code: 200,
			Data: result,
		})

		utils.PanicIfError(err)

		utils.NewSuccessResponse(string(bytes), w, r)
	}
}

func AnimeOnGoing(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")

	if page == "" {
		utils.PanicIfError(errors.New("page is required"))
	}

	_, err := strconv.Atoi(page)
	if err != nil {
		utils.PanicIfError(errors.New("page must be number"))
	}

	resp, err := http.Get(ENDPOINT + "ongoing-anime/page/" + page)
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []utils.HomePageResponse
	document.Find(".detpost").Each(func(i int, selection *goquery.Selection) {
		var anime utils.HomePageResponse

		anime.Episode = selection.Find(".epz").Text()
		anime.Url = selection.Find(".thumb a").AttrOr("href", "")
		anime.Thumbnail = selection.Find(".thumb a .thumbz img").AttrOr("src", "")
		anime.Title = selection.Find(".thumb a .thumbz h2").Text()

		// get anime id
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		result = append(result, anime)
	})

	bytes, err := json.Marshal(utils.DefaultResponse[[]utils.HomePageResponse]{
		Code: 200,
		Data: result,
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(bytes), w, r)
}

func AnimeComplete(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")

	if page == "" {
		utils.PanicIfError(errors.New("page is required"))
	}

	_, err := strconv.Atoi(page)
	if err != nil {
		utils.PanicIfError(errors.New("page must be number"))
	}

	resp, err := http.Get(ENDPOINT + "complete-anime/page/" + page)
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []utils.HomePageResponse
	document.Find(".detpost").Each(func(i int, selection *goquery.Selection) {
		var anime utils.HomePageResponse

		anime.Episode = selection.Find(".epz").Text()
		anime.Url = selection.Find(".thumb a").AttrOr("href", "")
		anime.Thumbnail = selection.Find(".thumb a .thumbz img").AttrOr("src", "")
		anime.Title = selection.Find(".thumb a .thumbz h2").Text()

		// get anime id
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		result = append(result, anime)
	})

	bytes, err := json.Marshal(utils.DefaultResponse[[]utils.HomePageResponse]{
		Code: 200,
		Data: result,
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(bytes), w, r)
}

func AnimeGenreList(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(ENDPOINT + "genre-list")
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	var result []string
	document.Find(".genres li a").Each(func(i int, selection *goquery.Selection) {
		genre := strings.ToLower(selection.Text())
		result = append(result, genre)
	})

	bytes, err := json.Marshal(utils.DefaultResponse[[]string]{
		Code: 200,
		Data: result,
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(bytes), w, r)
}

func AnimeFindByGenre(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	resp, err := http.Get(ENDPOINT + "genres/" + params["genre"])
	utils.PanicIfError(err)
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		utils.PanicIfError(err)
	}

	document, err := goquery.NewDocumentFromReader(resp.Body)
	utils.PanicIfError(err)

	html, err := document.Html()
	utils.PanicIfError(err)

	if !(strings.Contains(html, "col-anime-con")) {
		utils.PanicIfError(errors.New("genre not found"))
	}

	var result []utils.FindAnimeByGenreResponse
	document.Find(".col-anime-con .col-anime").Each(func(i int, selection *goquery.Selection) {
		var anime utils.FindAnimeByGenreResponse

		anime.Url = selection.Find(".col-anime-title a").AttrOr("href", "")
		anime.Thumbnail = selection.Find(".col-anime-cover img").AttrOr("src", "")
		anime.Title = selection.Find(".col-anime-title a").Text()
		anime.Episode = selection.Find(".col-anime-eps").Text()
		anime.Score = selection.Find(".col-anime-rating").Text()

		// get anime id
		anime.Id = selection.Find(".col-anime-thumb a").AttrOr("href", "")
		d := strings.Split(anime.Url, "/")
		anime.Id = d[4]

		// find genre
		var genre []string
		selection.Find(".col-anime-genre a").Each(func(i int, s *goquery.Selection) {
			genre = append(genre, s.Text())
		})

		anime.Genre = genre

		result = append(result, anime)
	})

	res, err := json.Marshal(utils.DefaultResponse[[]utils.FindAnimeByGenreResponse]{
		Code: 200,
		Data: result,
	})
	utils.PanicIfError(err)

	utils.NewSuccessResponse(string(res), w, r)
}
