"""initial schema

Revision ID: 38f2c3b49c10
Revises:
Create Date: 2025-09-23 02:03:10.652054

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "38f2c3b49c10"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String, nullable=False, unique=True, index=True),
        sa.Column("username", sa.String, nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String, nullable=False),
        sa.Column("first_name", sa.String, nullable=False),
        sa.Column("last_name", sa.String, nullable=False),
        sa.Column("phone", sa.String),
        sa.Column("role", sa.String, server_default="user"),
        sa.Column("status", sa.String, server_default="active"),
        sa.Column("avatar_url", sa.String),
        sa.Column("bio", sa.Text),
        sa.Column("is_verified", sa.Boolean, server_default=sa.text("false")),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true")),
        sa.Column(
            "created_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
        sa.Column(
            "updated_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
        sa.Column("last_login", sa.DateTime),
    )

    # Create properties table (simplified geometry handling; add manually if PostGIS enabled)
    op.create_table(
        "properties",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("title", sa.String, nullable=False, index=True),
        sa.Column("description", sa.Text),
        sa.Column("property_type", sa.String, nullable=False),
        sa.Column("status", sa.String, server_default="available"),
        sa.Column("address", sa.String, nullable=False),
        sa.Column("city", sa.String, nullable=False, index=True),
        sa.Column("state", sa.String, nullable=False, index=True),
        sa.Column("postal_code", sa.String, nullable=False),
        sa.Column("country", sa.String, server_default="Thailand"),
        sa.Column("latitude", sa.Float),
        sa.Column("longitude", sa.Float),
        sa.Column("bedrooms", sa.Integer, server_default="0", nullable=False),
        sa.Column("bathrooms", sa.Float, server_default="0", nullable=False),
        sa.Column("square_feet", sa.Integer),
        sa.Column("lot_size", sa.Float),
        sa.Column("year_built", sa.Integer),
        sa.Column("floor_number", sa.Integer),
        sa.Column("total_floors", sa.Integer),
        sa.Column("rent_price", sa.Float, nullable=False),
        sa.Column("security_deposit", sa.Float),
        sa.Column("is_furnished", sa.Boolean, server_default=sa.text("false")),
        sa.Column("pets_allowed", sa.Boolean, server_default=sa.text("false")),
        sa.Column("smoking_allowed", sa.Boolean, server_default=sa.text("false")),
        sa.Column("parking_available", sa.Boolean, server_default=sa.text("false")),
        sa.Column("utilities_included", sa.Boolean, server_default=sa.text("false")),
        sa.Column("min_lease_term", sa.Integer),
        sa.Column("max_lease_term", sa.Integer),
        sa.Column("available_from", sa.DateTime),
        sa.Column("views_count", sa.Integer, server_default="0"),
        sa.Column("is_featured", sa.Boolean, server_default=sa.text("false")),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true")),
        sa.Column(
            "created_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
        sa.Column(
            "updated_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
        sa.Column("owner_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
    )

    op.create_table(
        "amenities",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String, nullable=False, unique=True),
        sa.Column("description", sa.Text),
        sa.Column("icon", sa.String),
        sa.Column("category", sa.String),
        sa.Column(
            "created_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
    )

    op.create_table(
        "property_photos",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "property_id",
            sa.Integer,
            sa.ForeignKey("properties.id", ondelete="CASCADE"),
        ),
        sa.Column("url", sa.String, nullable=False),
        sa.Column("alt_text", sa.String),
        sa.Column("order_index", sa.Integer, server_default="0"),
    )

    op.create_table(
        "property_amenities",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "property_id",
            sa.Integer,
            sa.ForeignKey("properties.id", ondelete="CASCADE"),
        ),
        sa.Column(
            "amenity_id", sa.Integer, sa.ForeignKey("amenities.id", ondelete="CASCADE")
        ),
    )

    # Basic messaging tables (optional minimal)
    op.create_table(
        "threads",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("created_by", sa.Integer, sa.ForeignKey("users.id")),
        sa.Column(
            "created_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
    )
    op.create_table(
        "messages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "thread_id", sa.Integer, sa.ForeignKey("threads.id", ondelete="CASCADE")
        ),
        sa.Column("sender_id", sa.Integer, sa.ForeignKey("users.id")),
        sa.Column("recipient_id", sa.Integer, sa.ForeignKey("users.id")),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column(
            "created_at", sa.DateTime, server_default=sa.text("CURRENT_TIMESTAMP")
        ),
        sa.Column("is_read", sa.Boolean, server_default=sa.text("false")),
    )


def downgrade() -> None:
    op.drop_table("messages")
    op.drop_table("threads")
    op.drop_table("property_amenities")
    op.drop_table("property_photos")
    op.drop_table("amenities")
    op.drop_table("properties")
    op.drop_table("users")
