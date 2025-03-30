from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_migrate import Migrate
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from models import db, Simulation
from simulation import run_simulation

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:123456@localhost/Simulation"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/api/simulation", methods=["GET"])
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

@app.route("/api/report", methods=["POST"])
def generate_report():
    data = request.json
    
    model = data.get("model", "Модель невідома")
    params = data.get("params", {})
    stats = data.get("stats", {})

    key_to_label_mapping = {
      "beta": "Швидкість зараження (beta)",
      "gamma": "Швидкість одужання (gamma)",
      "days": "Кількість днів",
      "n": "Кількість людей",
      "initialS": "Початково сприйнятливі (S)",
      "initialI": "Початково інфіковані (I)",

      "r0": "Базове репродуктивне число (R0)",
      "max_infected": "Максимальна кількість інфікованих",
      "peak_day": "День піку інфікованих",
      "final_susceptible": "Кінцева кількість сприйнятливих",
      "final_recovered": "Кінцева кількість одужалих"
    }

    pdf_path = "simulation_report.pdf"
    pdfmetrics.registerFont(TTFont('TNR', 'times.ttf'))
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4
    X_INDENT = 75
    c.setFont("TNR", 16)
    c.drawString(X_INDENT, height - 50, "SIR Симуляція - Звіт")
    c.drawString(X_INDENT, height - 70, f"Модель: {str(model).upper()}")

    y_position = height - 230

    param_table_data = [["Вхідний параметр", "Значення"]] + [
        [key_to_label_mapping.get(k, k), round(v, 4)] for k, v in params.items()
    ]
    
    def create_styled_table(data, y_position):
        table = Table(data, colWidths=[250, 200])

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), "#9333ea"),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, -1), "TNR"),
            ("FONTSIZE", (0, 0), (-1, -1), 12),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("BACKGROUND", (0, 1), (-1, -1), colors.white),
            ("GRID", (0, 0), (-1, -1), 1, "#e4e4e7"),
        ]))
        table.wrapOn(c, width, height)
        table.drawOn(c, X_INDENT, y_position)

    create_styled_table(param_table_data, y_position)
    
    y_position -= 130

    stats_table_data = [["Показник", "Значення"]] + [
        [key_to_label_mapping.get(k, k), round(v, 4)] for k, v in stats.items()
    ]
    create_styled_table(stats_table_data, y_position)
    c.save()
    return send_file(pdf_path, as_attachment=True, download_name="simulation_report.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    app.run(debug=True)
