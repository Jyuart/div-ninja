package main

import (
	"io"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Client manager
type ClientManager struct {
	clients sync.Map
}

func (clientManager *ClientManager) AddClient(clientId string, conn *websocket.Conn) {
	clientManager.clients.Store(clientId, conn)
}

func (clientManager *ClientManager) GetClient(clientId string) *websocket.Conn {
	client, ok := clientManager.clients.Load(clientId)
	if ok {
		return client.(*websocket.Conn)
	}
	return nil
}

// Global variables
var upgrader = websocket.Upgrader{}
var clientManager ClientManager = ClientManager{}

func main() {
	http.HandleFunc("/", sayHello)
	http.HandleFunc("/ws/{id}", registerClient)

	err := http.ListenAndServe(":42069", nil)
	if err != nil {
		handleError(err)
	}
}

func sayHello(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, how are you?")
}

func registerClient(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		handleError(err)
		return
	}
	connId := r.PathValue("id")
	clientManager.AddClient(connId, conn)
	defer conn.Close()

	desktopClientId := r.URL.Query().Get("desktopClientId")

	if desktopClientId == "" {
		handleDesktopClient(conn)
	}

	desktopClient := clientManager.GetClient(desktopClientId)
	if desktopClient == nil {
		log.Println("Please login the desktop client first")
		return
	}
	handleMobileClient(conn, desktopClient)
}

func handleDesktopClient(conn *websocket.Conn) {
	// noting for now
}

func handleMobileClient(conn *websocket.Conn, desktopConn *websocket.Conn) {
	// Infinite loop for reading messages
	for {
		mt, messageBytes, err := conn.ReadMessage()
		if err != nil {
			handleError(err)
		}
		message := string(messageBytes)
	}
}

func handleError(error error) {
	log.Println(error)
}
