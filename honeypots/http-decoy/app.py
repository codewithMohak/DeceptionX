from flask import Flask, request
import json
import datetime

app = Flask(__name__)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def catch_all(path):

    log = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "src_ip": request.remote_addr,
        "method": request.method,
        "path": "/" + path,
        "headers": dict(request.headers)
    }

    with open("/var/log/http-decoy/requests.json", "a") as f:
        f.write(json.dumps(log) + "\n")

    return """
    <html>
        <h1>Corporate Portal</h1>
        <p>Unauthorized access prohibited.</p>
    </html>
    """