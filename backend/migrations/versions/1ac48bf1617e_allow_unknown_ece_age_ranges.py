"""allow unknown ece age ranges

Revision ID: 1ac48bf1617e
Revises: 356521117ff6
Create Date: 2026-08-17

"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "1ac48bf1617e"
down_revision: str | None = "356521117ff6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column(
        "ece_services",
        "minimum_age_months",
        existing_type=sa.Integer(),
        nullable=True,
        schema="app",
    )

    op.alter_column(
        "ece_services",
        "maximum_age_months",
        existing_type=sa.Integer(),
        nullable=True,
        schema="app",
    )


def downgrade() -> None:
    connection = op.get_bind()

    null_count = connection.execute(
        sa.text(
            """
            SELECT COUNT(*)
            FROM app.ece_services
            WHERE minimum_age_months IS NULL
               OR maximum_age_months IS NULL
            """
        )
    ).scalar_one()

    if null_count:
        raise RuntimeError(
            "Cannot downgrade: ECE records contain "
            "unknown age ranges."
        )

    op.alter_column(
        "ece_services",
        "maximum_age_months",
        existing_type=sa.Integer(),
        nullable=False,
        schema="app",
    )

    op.alter_column(
        "ece_services",
        "minimum_age_months",
        existing_type=sa.Integer(),
        nullable=False,
        schema="app",
    )
