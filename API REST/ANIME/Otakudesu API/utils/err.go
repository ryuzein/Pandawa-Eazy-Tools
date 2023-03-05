package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// PanicIfError helper function to panic if error is not nil
func PanicIfError(err error) {
	if err != nil {
		panic(err)
	}
}

// ErrorHandler is handler for handle error
func ErrorHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer handleError(w, r)

		h.ServeHTTP(w, r)
	})
}

// handleError recover all error and write error response
func handleError(w http.ResponseWriter, r *http.Request) {
	errHandle := recover()

	if errHandle != nil {
		bytes, err := json.Marshal(DefaultResponse[string]{
			Code: 400,
			Data: errHandle.(error).Error(),
		})

		if err != nil {
			log.Fatalln(err)
		}

		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(400)
		_, err = fmt.Fprint(w, string(bytes))
		if err != nil {
			log.Fatalln(err)
		}

		return
	}

}
