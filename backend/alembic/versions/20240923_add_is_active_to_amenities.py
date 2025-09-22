"""add is_active to amenities

Revision ID: add_is_active_amenities
Revises: 38f2c3b49c10
Create Date: 2025-09-23 04:30:00
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_is_active_amenities'
down_revision = '38f2c3b49c10'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_active column if it doesn't exist
    op.add_column('amenities', sa.Column('is_active', sa.Boolean, server_default=sa.text('true')))


def downgrade() -> None:
    op.drop_column('amenities', 'is_active')
