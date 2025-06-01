import numpy as np
from sir_models import seihr_model, seiqr_model, seir_model, seirv_model, sir_model
from scipy.integrate import odeint


def simulate_raw(model_func, y0, t, args, compartments):
    result = odeint(model_func, y0, t, args=args)
    unpacked = result.T
    return {
        "time": t.tolist(),
        **{comp: unpacked[i].tolist() for i, comp in enumerate(compartments)},
    }


def simulate_stats(
    model_func, y0, t, args, compartments, beta, gamma, extra_outputs=None
):
    raw = simulate_raw(model_func, y0, t, args, compartments)

    S = raw.get("S")
    I = raw.get("I")
    R = raw.get("R")
    peak_day = int(t[np.argmax(I)])
    max_infected = max(I)

    if (model_func == seihr_model or model_func == seiqr_model) and args[3] is not None: # SEIQR & SEIHR
        r0 = beta / (gamma + args[3])
    else:
        r0 = beta / gamma

    stats = {
        "max_infected": max_infected,
        "peak_day": peak_day,
        "r0": round(r0, 4),
        "hit": round((r0 - 1) / r0, 4),
        "final_susceptible": S[-1],
        "final_recovered": R[-1],
    }

    if extra_outputs:
        stats.update(extra_outputs(raw))

    return {**raw, **stats}


def run_simulation(
    model="sir",
    beta=0.3,
    gamma=0.1,
    sigma=0.2,
    delta=0.1,
    v_rate=0.05,
    h_rate=0.05,
    mu=0.02,
    days=100,
    n=100,
    initialS=99,
    initialI=1,
    with_stats=True,
):

    t = np.linspace(0, days, days)

    models = {
        "sir": {
            "func": sir_model,
            "y0": [initialS, initialI, 0],
            "args": (beta, gamma, n),
            "compartments": ["S", "I", "R"],
        },
        "seir": {
            "func": seir_model,
            "y0": [initialS, initialI, 0, 0],
            "args": (beta, sigma, gamma, n),
            "compartments": ["S", "E", "I", "R"],
        },
        "seiqr": {
            "func": seiqr_model,
            "y0": [initialS, initialI, 0, 0, 0],
            "args": (beta, sigma, gamma, delta, n),
            "compartments": ["S", "E", "I", "Q", "R"],
        },
        "seirv": {
            "func": seirv_model,
            "y0": [initialS, initialI, 0, 0, 0],
            "args": (beta, sigma, gamma, v_rate, n),
            "compartments": ["S", "E", "I", "R", "V"],
            "extra": lambda d: {"final_vaccinated": d["V"][-1]},
        },
        "seihr": {
            "func": seihr_model,
            "y0": [initialS, initialI, 0, 0, 0],
            "args": (beta, sigma, gamma, h_rate, mu, n),
            "compartments": ["S", "E", "I", "H", "R"],
        },
    }

    if model not in models:
        raise ValueError(f"Unknown model: {model}")

    config = models[model]
    if with_stats:
        return simulate_stats(
            config["func"],
            config["y0"],
            t,
            config["args"],
            config["compartments"],
            beta=beta,
            gamma=gamma,
            extra_outputs=config.get("extra"),
        )
    else:
        return simulate_raw(
            config["func"], config["y0"], t, config["args"], config["compartments"]
        )
