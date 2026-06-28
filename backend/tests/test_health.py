"""Integration test for the health check endpoint."""

from fastapi.testclient import TestClient


class TestHealthEndpoint:
    def test_returns_healthy_status(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_returns_service_name(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")

        data = response.json()
        assert "service" in data
        assert isinstance(data["service"], str)
        assert len(data["service"]) > 0

    def test_returns_version(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")

        data = response.json()
        assert "version" in data
        assert isinstance(data["version"], str)

    def test_returns_json_content_type(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")

        assert response.headers["content-type"] == "application/json"

    def test_returns_200_ok(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")

        assert response.status_code == 200
