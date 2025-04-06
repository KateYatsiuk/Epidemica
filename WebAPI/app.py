from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import Simulation, db
from simulation import run_simulation

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:123456@localhost/Epidemica"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/api/simulation", methods=["POST"])
def post_simulation():
    data = request.get_json()

    model = data.get("model", "sir")
    beta = float(data.get("beta", 0.3))
    gamma = float(data.get("gamma", 0.1))
    sigma = float(data.get("sigma", 0.2))
    delta = float(data.get("delta", 0.1))
    v_rate = float(data.get("vRate", 0.05))
    h_rate = float(data.get("hRate", 0.05))
    mu = float(data.get("mu", 0.02))
    D = float(data.get("D", 0.01))
    days = int(data.get("days", 100))
    n = int(data.get("n", 100))
    initialS = int(data.get("initialS", 99))
    initialI = int(data.get("initialI", 1))

    result = run_simulation(model, beta, gamma, sigma, delta, v_rate, h_rate, mu, D, days, n, initialS, initialI)

    simulation = Simulation(
        model=model,
        N=n,
        initialS=initialS,
        initialI=initialI,
        beta=beta,
        gamma=gamma,
        sigma=sigma if model in ["seir", "seihr", "seiqr", "seirv"] else None,
        delta=delta if model == "seiqr" else None,
        v_rate=v_rate if model == "seirv" else None,
        h_rate=h_rate if model == "seihr" else None,
        mu=mu if model == "seihr" else None,
        D=D if model == "sir_diffusion" else None,
        days=days,
        max_infected=float(result["max_infected"]),
        peak_day=int(result["peak_day"]),
        final_susceptible=float(result["final_susceptible"]),
        final_recovered=float(result["final_recovered"])
    )
    
    db.session.add(simulation)
    db.session.commit()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
