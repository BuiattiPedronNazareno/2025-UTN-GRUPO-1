using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCancelacionesConRelaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones");

            migrationBuilder.DropIndex(
                name: "IX_Cancelaciones_Rutina",
                table: "Cancelaciones");

            migrationBuilder.DropColumn(
                name: "Rutina",
                table: "Cancelaciones");

            migrationBuilder.AddColumn<bool>(
                name: "RecibeNotificacionesCancelacion",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Cancelaciones_rutinaID",
                table: "Cancelaciones",
                column: "rutinaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Cancelaciones_Rutinas_rutinaID",
                table: "Cancelaciones",
                column: "rutinaID",
                principalTable: "Rutinas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cancelaciones_Rutinas_rutinaID",
                table: "Cancelaciones");

            migrationBuilder.DropIndex(
                name: "IX_Cancelaciones_rutinaID",
                table: "Cancelaciones");

            migrationBuilder.DropColumn(
                name: "RecibeNotificacionesCancelacion",
                table: "Usuarios");

            migrationBuilder.AddColumn<int>(
                name: "Rutina",
                table: "Cancelaciones",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cancelaciones_Rutina",
                table: "Cancelaciones",
                column: "Rutina");

            migrationBuilder.AddForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones",
                column: "Rutina",
                principalTable: "Rutinas",
                principalColumn: "Id");
        }
    }
}
