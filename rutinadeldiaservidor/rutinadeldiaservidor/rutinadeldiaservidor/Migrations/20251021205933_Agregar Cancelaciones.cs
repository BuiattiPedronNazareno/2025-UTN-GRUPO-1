using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCancelaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cancelaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fechaHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    rutinaID = table.Column<int>(type: "integer", nullable: false),
                    Rutina = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cancelaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cancelaciones_Rutinas_Rutina",
                        column: x => x.Rutina,
                        principalTable: "Rutinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cancelaciones_Rutina",
                table: "Cancelaciones",
                column: "Rutina");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cancelaciones");
        }
    }
}
