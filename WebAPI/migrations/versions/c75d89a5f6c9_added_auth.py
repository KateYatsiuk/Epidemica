"""Added auth

Revision ID: c75d89a5f6c9
Revises: e8a73c713721
Create Date: 2025-04-13 19:42:56.463858

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c75d89a5f6c9'
down_revision = 'e8a73c713721'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('token_blocklist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('token_blocklist')
    # ### end Alembic commands ###
