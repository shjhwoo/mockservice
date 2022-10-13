package main

import (
	"log"
	"mock/application"
	"net/http"
)

var port = "5001"

func main() {
	err := http.ListenAndServe(":"+port, application.SetupRouter())
	if err != nil {
		log.Fatal(err)
	}
}
