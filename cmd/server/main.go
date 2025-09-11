package main

import (
	"log"
	"net/http"

	"project/internal/conf"
	"project/internal/router"
)

func main() {
	// Load configuration
	config := conf.Load()

	// Create router
	r := router.New()

	// Start server
	log.Printf("Server starting on port %s", config.Port)
	if err := http.ListenAndServe(":"+config.Port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
