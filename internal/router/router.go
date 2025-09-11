package router

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"strings"
)

// Response defines the structure of the ping response
type Response struct {
	Pong    bool   `json:"pong"`
	Version string `json:"version"`
	Commit  string `json:"commit"`
}

// New creates a new HTTP router with registered routes
func New() *http.ServeMux {
	mux := http.NewServeMux()

	// Register the ping route
	mux.HandleFunc("/ping", pingHandler)

	return mux
}

// pingHandler handles the /ping route
func pingHandler(w http.ResponseWriter, r *http.Request) {
	// Get the git commit hash
	commit := getGitCommit()

	// Create the response
	response := Response{
		Pong:    true,
		Version: "v0.0.1",
		Commit:  commit,
	}

	// Set the content type and write the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// getGitCommit retrieves the current git commit hash
func getGitCommit() string {
	// Try to get the git commit hash
	cmd := exec.Command("git", "rev-parse", "HEAD")
	output, err := cmd.Output()
	if err != nil {
		// If we can't get the git commit, return "unknown"
		return "unknown"
	}

	// Trim any whitespace and return the commit hash
	return strings.TrimSpace(string(output))
}
