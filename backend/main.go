package main

import (
	"github.com/gorilla/websocket"
	"io"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func main() {
	http.HandleFunc("/", sayHello)
	http.HandleFunc("/ws", registerClient)

	err := http.ListenAndServe(":42069", nil)
	if err != nil {
		panic("Something bad happened")
	}
}

func sayHello(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, how are you?")
}

func registerClient(w http.ResponseWriter, r *http.Request) {
	_, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
}
