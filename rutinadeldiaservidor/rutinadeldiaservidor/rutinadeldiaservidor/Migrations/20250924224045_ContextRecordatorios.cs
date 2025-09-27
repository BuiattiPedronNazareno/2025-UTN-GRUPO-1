using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class ContextRecordatorios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recordatorio_Rutinas_RutinaId",
                table: "Recordatorio");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Recordatorio",
                table: "Recordatorio");

            migrationBuilder.RenameTable(
                name: "Recordatorio",
                newName: "Recordatorios");

            migrationBuilder.RenameIndex(
                name: "IX_Recordatorio_RutinaId",
                table: "Recordatorios",
                newName: "IX_Recordatorios_RutinaId");

            migrationBuilder.AlterColumn<string>(
                name: "Hora",
                table: "Recordatorios",
                type: "varchar(5)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Recordatorios",
                table: "Recordatorios",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Recordatorios_Rutinas_RutinaId",
                table: "Recordatorios",
                column: "RutinaId",
                principalTable: "Rutinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recordatorios_Rutinas_RutinaId",
                table: "Recordatorios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Recordatorios",
                table: "Recordatorios");

            migrationBuilder.RenameTable(
                name: "Recordatorios",
                newName: "Recordatorio");

            migrationBuilder.RenameIndex(
                name: "IX_Recordatorios_RutinaId",
                table: "Recordatorio",
                newName: "IX_Recordatorio_RutinaId");

            migrationBuilder.AlterColumn<string>(
                name: "Hora",
                table: "Recordatorio",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(5)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Recordatorio",
                table: "Recordatorio",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Recordatorio_Rutinas_RutinaId",
                table: "Recordatorio",
                column: "RutinaId",
                principalTable: "Rutinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
