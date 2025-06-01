from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from models import Simulation, db
from simulation_utils import run_simulation

simulation_bp = Blueprint("simulation", __name__)


# TODO: improve & clean code
@simulation_bp.route("", methods=["POST"])
@jwt_required()
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
    days = int(data.get("days", 100))
    n = int(data.get("n", 100))
    initialS = int(data.get("initialS", 99))
    initialI = int(data.get("initialI", 1))

    result = run_simulation(
        model,
        beta,
        gamma,
        sigma,
        delta,
        v_rate,
        h_rate,
        mu,
        days,
        n,
        initialS,
        initialI,
    )

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
        days=days,
        max_infected=float(result["max_infected"]),
        peak_day=int(result["peak_day"]),
        final_susceptible=float(result["final_susceptible"]),
        final_recovered=float(result["final_recovered"]),
        user_id=current_user.id,
    )

    db.session.add(simulation)
    db.session.commit()
    return jsonify(result)


@simulation_bp.route("/view", methods=["POST"])
@jwt_required()
def view_simulation():
    data = request.get_json()

    model = data.get("model", "sir")
    beta = float(data.get("beta", 0.3))
    gamma = float(data.get("gamma", 0.1))
    sigma = float(data.get("sigma", 0.2))
    delta = float(data.get("delta", 0.1))
    v_rate = float(data.get("vRate", 0.05))
    h_rate = float(data.get("hRate", 0.05))
    mu = float(data.get("mu", 0.02))
    days = int(data.get("days", 100))
    n = int(data.get("n", 100))
    initialS = int(data.get("initialS", 99))
    initialI = int(data.get("initialI", 1))

    result = run_simulation(
        model,
        beta,
        gamma,
        sigma,
        delta,
        v_rate,
        h_rate,
        mu,
        days,
        n,
        initialS,
        initialI,
        with_stats=False,
    )
    return jsonify(result)


@simulation_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 10))

    query = Simulation.query.filter_by(user_id=current_user.id).order_by(
        Simulation.created_at.desc()
    )
    total = query.count()
    simulations = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify(
        {
            "simulations": [
                {
                    "id": s.id,
                    "model": s.model,
                    "created_at": s.created_at.isoformat(),
                    "days": s.days,
                    "n": s.N,
                    "final_susceptible": round(s.final_susceptible),
                    "final_recovered": round(s.final_recovered),
                    "max_infected": round(s.max_infected),
                    "peak_day": s.peak_day,
                    "r0": s.r0,
                    "hit": s.hit,
                }
                for s in simulations
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    )


@simulation_bp.route("/<string:sim_id>", methods=["GET"])
@jwt_required()
def get_simulation(sim_id):
    sim = Simulation.query.filter_by(id=sim_id, user_id=current_user.id).first()

    if not sim:
        return jsonify({"error": "Not found"}), 404

    return jsonify(sim.to_dict())


@simulation_bp.route("/<string:sim_id>", methods=["DELETE"])
@jwt_required()
def delete_simulation(sim_id):
    simulation = Simulation.query.filter_by(id=sim_id, user_id=current_user.id).first()

    if simulation is None:
        abort(404, description="Simulation not found")

    db.session.delete(simulation)
    db.session.commit()

    return jsonify({"message": f"Simulation with ID {sim_id} successfully deleted"})


@simulation_bp.route("/compare", methods=["POST"])
@jwt_required()
def compare_simulations():
    try:
        simulation_ids = request.json.get("simulation_ids", [])

        if not simulation_ids:
            return jsonify({"error": "No simulation IDs provided"}), 400

        simulations = Simulation.query.filter(
            Simulation.id.in_(simulation_ids), Simulation.user_id == current_user.id
        ).all()

        if not simulations:
            return jsonify({"error": "Simulations not found"}), 404

        response_data = [
            {
                "id": s.id,
                "model": s.model,
                "created_at": s.created_at.isoformat(),
                "days": s.days,
                "n": s.N,
                "max_infected": round(s.max_infected),
                "peak_day": s.peak_day,
                "final_susceptible": round(s.final_susceptible),
                "final_recovered": round(s.final_recovered),
                "r0": s.r0,
                "hit": s.hit,
                "sigma": s.sigma,
                "delta": s.delta,
                "v_rate": s.v_rate,
                "h_rate": s.h_rate,
                "mu": s.mu,
                "initialS": s.initialS,
                "initialI": s.initialI,
                "beta": s.beta,
                "gamma": s.gamma
            }
            for s in simulations
        ]

        return jsonify({"simulations": response_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
