from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import TokenBlocklist, User, db
from flask_jwt_extended import JWTManager
from simulation import simulation_bp
from auth import auth_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "postgresql://postgres:123456@localhost/Epidemica"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "someverysecretkeyisinsertedheree"
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
    )

    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager()
    jwt.init_app(app)

    app.register_blueprint(simulation_bp, url_prefix="/simulation")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_headers, jwt_data):
        identity = jwt_data["sub"]
        return User.query.filter_by(email=identity).one_or_none()

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Signature verification failed"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Request doesnt contain valid token"}), 401

    @jwt.token_in_blocklist_loader
    def token_in_blocklist_callback(jwt_header, jwt_data):
        jti = jwt_data["jti"]
        token = (
            db.session.query(TokenBlocklist).filter(TokenBlocklist.jti == jti).scalar()
        )
        return token is not None

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
