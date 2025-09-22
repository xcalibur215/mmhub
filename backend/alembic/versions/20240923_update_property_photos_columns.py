"""update property_photos columns

Revision ID: update_property_photos_columns
Revises: add_is_active_amenities
Create Date: 2025-09-23 04:40:00
"""
from alembic import op
import sqlalchemy as sa


revision = 'update_property_photos_columns'
down_revision = 'add_is_active_amenities'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns expected by ORM model
    op.add_column('property_photos', sa.Column('caption', sa.String(), nullable=True))
    op.add_column('property_photos', sa.Column('display_order', sa.Integer(), server_default='0'))
    op.add_column('property_photos', sa.Column('is_primary', sa.Boolean(), server_default=sa.text('false')))
    op.add_column('property_photos', sa.Column('file_size', sa.Integer(), nullable=True))
    op.add_column('property_photos', sa.Column('width', sa.Integer(), nullable=True))
    op.add_column('property_photos', sa.Column('height', sa.Integer(), nullable=True))
    op.add_column('property_photos', sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP')))

    # Remove old order_index column if present
    try:
        op.drop_column('property_photos', 'order_index')
    except Exception:
        # Column might already be absent if schema drift occurred; ignore
        pass


def downgrade() -> None:
    # Recreate order_index
    op.add_column('property_photos', sa.Column('order_index', sa.Integer(), server_default='0'))

    # Drop newly added columns
    op.drop_column('property_photos', 'created_at')
    op.drop_column('property_photos', 'height')
    op.drop_column('property_photos', 'width')
    op.drop_column('property_photos', 'file_size')
    op.drop_column('property_photos', 'is_primary')
    op.drop_column('property_photos', 'display_order')
    op.drop_column('property_photos', 'caption')
