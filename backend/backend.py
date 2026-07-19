# Flask example
from flask import jsonify

@app.route("/api/telemetry")
def telemetry():
    return jsonify({
        "battery": {"percent": 87, "voltage": 12.4},
        "watchdog": {"status": "OK", "lastPing": "2026-07-18T10:22:00Z"},
        "sog": 2.3,
        "cog": 184,
        "coordinate": {"lat": -6.2, "lon": 106.8},
    })