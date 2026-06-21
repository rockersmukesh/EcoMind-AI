from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_calculate_endpoint():
    payload = {
        "transportation": {"milesPerWeek": 100, "vehicleType": "gas"},
        "diet": {"dietType": "vegetarian"},
        "energy": {"kwhPerMonth": 300, "source": "grid"},
        "shopping": {"newClothesPerMonth": 2, "techUpgradesPerYear": 1}
    }
    response = client.post("/api/footprint/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["total_kg"] == 457.29

def test_recommendations_endpoint():
    payload = {
        "transportation": {"milesPerWeek": 100, "vehicleType": "gas"},
        "diet": {"dietType": "vegetarian"},
        "energy": {"kwhPerMonth": 300, "source": "grid"},
        "shopping": {"newClothesPerMonth": 2, "techUpgradesPerYear": 1}
    }
    response = client.post("/api/coach/recommendations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "calculated_profile" in data
    assert "ai_coach_response" in data
    assert "eco_score_estimate" in data["ai_coach_response"]

def test_simulate_endpoint():
    payload = {
        "current": {
            "transportation": {"milesPerWeek": 100, "vehicleType": "gas"},
            "diet": {"dietType": "vegetarian"},
            "energy": {"kwhPerMonth": 300, "source": "grid"},
            "shopping": {"newClothesPerMonth": 2, "techUpgradesPerYear": 1}
        },
        "simulated": {
            "transportation": {"milesPerWeek": 20, "vehicleType": "walk_bike"},
            "diet": {"dietType": "vegan"},
            "energy": {"kwhPerMonth": 300, "source": "solar"},
            "shopping": {"newClothesPerMonth": 1, "techUpgradesPerYear": 0}
        }
    }
    response = client.post("/api/coach/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "current_profile" in data
    assert "simulated_profile" in data
    assert "simulation_feedback" in data
    assert "projected_yearly_savings_kg" in data["simulation_feedback"]
