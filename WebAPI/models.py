import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

db = SQLAlchemy()

def generate_guid():
    return str(uuid.uuid4())

class Simulation(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_guid)
    model = db.Column(db.String(20), nullable=False)
    N = db.Column(db.Integer, nullable=False, default=100)
    initialS=db.Column(db.Integer, nullable=False, default=99)
    initialI=db.Column(db.Integer, nullable=False, default=1)
    beta = db.Column(db.Float, nullable=False)
    gamma = db.Column(db.Float, nullable=False)
    sigma = db.Column(db.Float)  # Для SEIR, SEIHR, SEIQR, SEIRV
    delta = db.Column(db.Float)  # Для SEIHR, SEIQR
    v_rate = db.Column(db.Float)  # Для SEIRV
    h_rate = db.Column(db.Float)  # Для SEIHR
    # TODO: delete diffusion
    mu = db.Column(db.Float)  # Для SIR-diffusion
    D = db.Column(db.Float)  # Для SIR-diffusion
    days = db.Column(db.Integer, nullable=False)

    max_infected = db.Column(db.Float, nullable=False)
    peak_day = db.Column(db.Integer, nullable=False)
    final_susceptible = db.Column(db.Float, nullable=False)
    final_recovered = db.Column(db.Float, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @hybrid_property
    def r0(self):
        return round(self.beta / self.gamma, 4)
    
    def to_dict(self):
        data = {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
        }
        data["created_at"] = self.created_at.isoformat() if self.created_at else None
        return data
