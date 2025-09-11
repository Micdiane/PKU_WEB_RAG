package router

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPingHandler(t *testing.T) {
	// Create a request to the /ping endpoint
	req, err := http.NewRequest("GET", "/ping", nil)
	assert.NoError(t, err)

	// Create a response recorder
	rr := httptest.NewRecorder()

	// Create the router and serve the request
	router := New()
	router.ServeHTTP(rr, req)

	// Check the status code
	assert.Equal(t, http.StatusOK, rr.Code)

	// Check the response body
	expected := `{"pong":true,"version":"v0.0.1","commit":"unknown"}`
	assert.JSONEq(t, expected, rr.Body.String())
}
