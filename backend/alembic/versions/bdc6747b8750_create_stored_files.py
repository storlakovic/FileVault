"""create stored files table

Revision ID: bdc6747b8750
Revises: e90ff5934936
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "bdc6747b8750"
down_revision: Union[str, Sequence[str], None] = "e90ff5934936"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "stored_files",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("original_name", sa.String(length=255), nullable=False),
        sa.Column("storage_name", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=255), nullable=False),
        sa.Column("size", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["owner_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("storage_name"),
    )

    op.create_index(
        op.f("ix_stored_files_owner_id"),
        "stored_files",
        ["owner_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_stored_files_owner_id"),
        table_name="stored_files",
    )
    op.drop_table("stored_files")
