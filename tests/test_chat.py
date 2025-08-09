import os
import sys
from unittest.mock import Mock, patch

import pytest
from fastapi.testclient import TestClient

# Ensure the src directory is on the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from main import app

client = TestClient(app)


def test_chat_returns_trimmed_response():
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"response": " Hello world "}

    with patch("main.requests.post", return_value=mock_response):
        res = client.post("/chat", json={"prompt": "hola"})

    assert res.status_code == 200
    assert res.json() == {"respuesta": "Hello world"}


@pytest.mark.parametrize("status_code", [400, 500])
def test_chat_handles_upstream_error(status_code):
    mock_response = Mock()
    mock_response.status_code = status_code

    with patch("main.requests.post", return_value=mock_response):
        res = client.post("/chat", json={"prompt": "hola"})

    assert res.status_code == 200
    assert res.json() == {"respuesta": "Error al conectar con Ollama/Mistral."}
