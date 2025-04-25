from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt,
    current_user,
    get_jwt_identity,
)
from models import User, TokenBlocklist

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register_user():
    data = request.get_json()
    user = User.get_user_by_email(email=data.get("email"))

    if user is not None:
        return jsonify({"message": "Користувач з таким емейлом вже існує"}), 409

    new_user = User(email=data.get("email"))
    new_user.set_password(password=data.get("password"))
    new_user.save()

    access_token = create_access_token(identity=new_user.email)
    refresh_token = create_refresh_token(identity=new_user.email)
    return jsonify({"access": access_token, "refresh": refresh_token}), 201


@auth_bp.post("/login")
def login_user():
    data = request.get_json()
    user = User.get_user_by_email(email=data.get("email"))

    if user and (user.check_password(password=data.get("password"))):
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)
        return jsonify({"access": access_token, "refresh": refresh_token}), 200

    return jsonify({"message": "Неправильний логін або пароль"}), 400


@auth_bp.get("/whoami")
@jwt_required()
def whoami():
    return jsonify({"user_details": {"email": current_user.email}})


@auth_bp.get("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)

    return jsonify({"access_token": new_access_token})


@auth_bp.get("/logout")
@jwt_required(verify_type=False)
def logout_user():
    jwt = get_jwt()
    jti = jwt["jti"]
    token_b = TokenBlocklist(jti=jti)
    token_b.save()

    return jsonify({}), 200
