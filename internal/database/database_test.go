package database

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
)

func TestPostgresContainer(t *testing.T) {
	ctx := context.Background()

	// Create a Postgres container
	pgContainer, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: testcontainers.ContainerRequest{
			Image:        "docker.io/postgres:15",
			ExposedPorts: []string{"5432/tcp"},
			Env: map[string]string{
				"POSTGRES_DB":       "test-db",
				"POSTGRES_USER":     "test-user",
				"POSTGRES_PASSWORD": "test-password",
			},
			WaitingFor: wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(30 * time.Second),
		},
		Started: true,
	})
	assert.NoError(t, err)
	defer func() {
		if err := pgContainer.Terminate(ctx); err != nil {
			t.Fatalf("failed to terminate container: %s", err)
		}
	}()

	// Get the connection string
	host, err := pgContainer.Host(ctx)
	assert.NoError(t, err)

	port, err := pgContainer.MappedPort(ctx, "5432/tcp")
	assert.NoError(t, err)

	connStr := "host=" + host + " port=" + port.Port() + " user=test-user password=test-password dbname=test-db sslmode=disable"

	// Print the connection string (in a real test, you would use it to connect to the database)
	t.Logf("Connection string: %s", connStr)
}
