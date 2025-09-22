using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class modificacionUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_InfanteNiveles_InfanteNivelId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_InfanteNivelId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "InfanteNivelId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Pin",
                table: "Usuarios");

            migrationBuilder.CreateTable(
                name: "Adultos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Pin = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adultos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Adultos_Usuarios_Id",
                        column: x => x.Id,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Infantes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    InfanteNivelId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Infantes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Infantes_InfanteNiveles_InfanteNivelId",
                        column: x => x.InfanteNivelId,
                        principalTable: "InfanteNiveles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Infantes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Infantes_InfanteNivelId",
                table: "Infantes",
                column: "InfanteNivelId");

            migrationBuilder.CreateIndex(
                name: "IX_Infantes_UsuarioId",
                table: "Infantes",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Adultos");

            migrationBuilder.DropTable(
                name: "Infantes");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Usuarios",
                type: "character varying(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "InfanteNivelId",
                table: "Usuarios",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Pin",
                table: "Usuarios",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_InfanteNivelId",
                table: "Usuarios",
                column: "InfanteNivelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_InfanteNiveles_InfanteNivelId",
                table: "Usuarios",
                column: "InfanteNivelId",
                principalTable: "InfanteNiveles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
