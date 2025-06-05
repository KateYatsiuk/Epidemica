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


def seiqr_model(y, t, beta, sigma, gamma, delta, mu_q, N):
    S, E, I, Q, R = y
    dSdt = -beta * S * I / N
    dEdt = beta * S * I / N - sigma * E
    dIdt = sigma * E - gamma * I - delta * I
    dQdt = delta * I - mu_q * Q
    dRdt = gamma * I + mu_q * Q
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
