from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Simulation
from simulation import run_simulation

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:123456@localhost/Simulation"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/api/simulation", methods=["POST"])
def get_simulation():
    model = request.args.get("model", "sir")
    beta = float(request.args.get("beta", 0.3))
    gamma = float(request.args.get("gamma", 0.1))
    sigma = float(request.args.get("sigma", 0.2))
    delta = float(request.args.get("delta", 0.1))
    v_rate = float(request.args.get("vRate", 0.05))
    h_rate = float(request.args.get("hRate", 0.05))
    mu = float(request.args.get("mu", 0.02))
    D = float(request.args.get("D", 0.01))
    days = int(request.args.get("days", 100))
    n = int(request.args.get("n", 100))
    initialS = int(request.args.get("initialS", 99))
    initialI = int(request.args.get("initialI", 1))

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
    
    # db.session.add(simulation)
    # db.session.commit()
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
