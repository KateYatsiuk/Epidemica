import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()


def generate_guid():
    return str(uuid.uuid4())


class Simulation(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_guid)
    model = db.Column(db.String(20), nullable=False)
    N = db.Column(db.Integer, nullable=False, default=100)
    initialS = db.Column(db.Integer, nullable=False, default=99)
    initialI = db.Column(db.Integer, nullable=False, default=1)
    beta = db.Column(db.Float, nullable=False)
    gamma = db.Column(db.Float, nullable=False)
    sigma = db.Column(db.Float)  # SEIR, SEIHR, SEIQR, SEIRV
    delta = db.Column(db.Float)  # SEIQR
    v_rate = db.Column(db.Float)  # SEIRV
    h_rate = db.Column(db.Float)  # SEIHR
    mu = db.Column(db.Float)  # SEIHR
    days = db.Column(db.Integer, nullable=False)

    max_infected = db.Column(db.Float, nullable=False)
    peak_day = db.Column(db.Integer, nullable=False)
    final_susceptible = db.Column(db.Float, nullable=False)
    final_recovered = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    user = relationship("User", backref="simulations")

    @hybrid_property
    def r0(self):
        return round(self.beta / self.gamma, 4)

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        data["r0"] = self.r0
        data["created_at"] = self.created_at.isoformat() if self.created_at else None
        return data


class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_guid)
    email = db.Column(db.String, nullable=False)
    password = db.Column(db.Text)

    def __repr__(self):
        return f"<User {self.email}>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Token {self.jti}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
