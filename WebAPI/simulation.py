import numpy as np
from scipy.integrate import odeint

# TODO: improve code
def sir_model(y, t, beta, gamma, N):
    S, I, R = y
    dSdt = -beta * S * I / N
    dIdt = beta * S * I / N - gamma * I
    dRdt = gamma * I
    return [dSdt, dIdt, dRdt]

def seir_model(y, t, beta, sigma, gamma, N):
    S, E, I, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I
    dRdt = gamma * I
    return [dSdt, dEdt, dIdt, dRdt]

def seiqr_model(y, t, beta, sigma, gamma, delta, N):
    S, E, I, Q, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I - delta * I
    dQdt = delta * I - gamma * Q
    dRdt = gamma * (I + Q)
    return [dSdt, dEdt, dIdt, dQdt, dRdt]

def seirv_model(y, t, beta, sigma, gamma, v_rate, N):
    S, E, I, R, V = y
    dSdt = -beta * S * I / N - v_rate * S
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I
    dRdt = gamma * I
    dVdt = v_rate * S
    return [dSdt, dEdt, dIdt, dRdt, dVdt]

def seihr_model(y, t, beta, sigma, gamma, h_rate, mu, N):
    S, E, I, H, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I - h_rate * I
    dHdt = h_rate * I - mu * H
    dRdt = gamma * I + mu * H
    return [dSdt, dEdt, dIdt, dHdt, dRdt]

def sir_diffusion(y, t, beta, gamma, D): # TODO: доробити
    S1, I1, R1, S2, I2, R2 = y
    dS1dt = -beta * S1 * I1 + D * (S2 - S1)
    dI1dt = beta * S1 * I1 - gamma * I1 + D * (I2 - I1)
    dR1dt = gamma * I1 + D * (R2 - R1)
    
    dS2dt = -beta * S2 * I2 + D * (S1 - S2)
    dI2dt = beta * S2 * I2 - gamma * I2 + D * (I1 - I2)
    dR2dt = gamma * I2 + D * (R1 - R2)
    
    return [dS1dt, dI1dt, dR1dt, dS2dt, dI2dt, dR2dt]

def run_simulation(model="sir", beta=0.3, gamma=0.1, sigma=0.2, delta=0.1, v_rate=0.05, h_rate=0.05, mu=0.02, D=0.01, days=100, n=100, initialS=99, initialI=1):
    t = np.linspace(0, days, days)

    if model == "sir":
        y0 = [initialS, initialI, 0]
        result = odeint(sir_model, y0, t, args=(beta, gamma, n))
        S, I, R = result.T
        return {
            "time": t.tolist(), "S": S.tolist(), "I": I.tolist(), "R": R.tolist(),
            "max_infected": max(I), "peak_day": int(t[np.argmax(I)]),
            "final_susceptible": S[-1], "final_recovered": R[-1],
            "r0": round(beta / gamma)
        }

    elif model == "seir":
        y0 = [initialS, initialI, 0, 0]
        result = odeint(seir_model, y0, t, args=(beta, sigma, gamma, n))
        S, E, I, R = result.T
        return {
            "time": t.tolist(), "S": S.tolist(), "E": E.tolist(), "I": I.tolist(), "R": R.tolist(),
            "max_infected": max(I), "peak_day": int(t[np.argmax(I)]),
            "final_susceptible": S[-1], "final_recovered": R[-1],
            "r0": round(beta / gamma)
        }

    elif model == "seiqr":
        y0 = [initialS, initialI, 0, 0, 0]
        result = odeint(seiqr_model, y0, t, args=(beta, sigma, gamma, delta, n))
        S, E, I, Q, R = result.T
        return {
            "time": t.tolist(), "S": S.tolist(), "E": E.tolist(), "I": I.tolist(), "Q": Q.tolist(), "R": R.tolist(),
            "max_infected": max(I), "peak_day": int(t[np.argmax(I)]),
            "final_susceptible": S[-1], "final_recovered": R[-1],
            "r0": round(beta / gamma)
        }

    elif model == "seirv":
        y0 = [initialS, initialI, 0, 0, 0]
        result = odeint(seirv_model, y0, t, args=(beta, sigma, gamma, v_rate, n))
        S, E, I, R, V = result.T
        return {
            "time": t.tolist(), "S": S.tolist(), "E": E.tolist(), "I": I.tolist(), "R": R.tolist(), "V": V.tolist(),
            "max_infected": max(I), "peak_day": int(t[np.argmax(I)]),
            "final_susceptible": S[-1], "final_recovered": R[-1], "final_vaccinated": V[-1],
            "r0": round(beta / gamma)
        }

    elif model == "seihr":
        y0 = [initialS, initialI, 0, 0, 0]
        result = odeint(seihr_model, y0, t, args=(beta, sigma, gamma, h_rate, mu, n))
        S, E, I, H, R = result.T
        return {
            "time": t.tolist(), "S": S.tolist(), "E": E.tolist(), "I": I.tolist(), "H": H.tolist(), "R": R.tolist(),
            "max_infected": max(I), "peak_day": int(t[np.argmax(I)]),
            "final_susceptible": S[-1], "final_recovered": R[-1],
            "r0": round(beta / gamma)
        }

    elif model == "sir_diffusion":
        y0 = [initialS, initialI, 0, 0.99, 0.01, 0]
        result = odeint(sir_diffusion, y0, t, args=(beta, gamma, D))
        S1, I1, R1, S2, I2, R2 = result.T
        return {
            "time": t.tolist(), "S1": S1.tolist(), "I1": I1.tolist(), "R1": R1.tolist(),
            "S2": S2.tolist(), "I2": I2.tolist(), "R2": R2.tolist(),
            "max_infected": max(max(I1), max(I2)), "peak_day": int(t[np.argmax(I1)]),
            "final_susceptible": S1[-1] + S2[-1], "final_recovered": R1[-1] + R2[-1],
            "r0": round(beta / gamma)
        }
    
    else:
        raise ValueError(f"Unknown model: {model}")
