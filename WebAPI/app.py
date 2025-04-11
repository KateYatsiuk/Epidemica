from flask import Flask, request, jsonify, abort
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

@app.route("/api/history", methods=["GET"])
def get_history():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))

    query = Simulation.query.order_by(Simulation.created_at.desc())
    total = query.count()
    simulations = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify({
        "simulations": [
            {
                "id": s.id,
                "model": s.model,
                "created_at": s.created_at.isoformat(),
                "days": s.days,
                "max_infected": s.max_infected,
                "peak_day": s.peak_day,
                "r0": s.r0
            } for s in simulations
        ],
        "total": total,
        "page": page,
        "page_size": page_size
    })

@app.route("/api/simulation/<string:sim_id>", methods=["DELETE"])
def delete_simulation(sim_id):
    simulation = Simulation.query.get(sim_id)

    if simulation is None:
        abort(404, description="Simulation not found")

    db.session.delete(simulation)
    db.session.commit()

    return jsonify({"message": f"Simulation with ID {sim_id} successfully deleted"})

@app.route("/api/compare", methods=["POST"])
def compare_simulations():
    try:
        simulation_ids = request.json.get("simulation_ids", [])
        
        if not simulation_ids:
            return jsonify({"error": "No simulation IDs provided"}), 400
        
        simulations = Simulation.query.filter(Simulation.id.in_(simulation_ids)).all()
        
        if not simulations:
            return jsonify({"error": "Simulations not found"}), 404
        
        response_data = [
            {
                "id": s.id,
                "model": s.model,
                "created_at": s.created_at.isoformat(),
                "days": s.days,
                "max_infected": s.max_infected,
                "peak_day": s.peak_day,
                "final_susceptible": s.final_susceptible,
                "final_recovered": s.final_recovered,
                "r0": s.r0
                # "curve": [
                #     {"day": day, "infected": infected} for day, infected in enumerate(s.infected_curve)
                # ]
            }
            for s in simulations
        ]
        
        return jsonify({"simulations": response_data})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
