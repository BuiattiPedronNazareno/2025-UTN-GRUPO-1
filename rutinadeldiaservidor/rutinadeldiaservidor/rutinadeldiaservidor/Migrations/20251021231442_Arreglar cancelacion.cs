using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class Arreglarcancelacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones");

            migrationBuilder.AlterColumn<int>(
                name: "rutinaID",
                table: "Cancelaciones",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Rutina",
                table: "Cancelaciones",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones",
                column: "Rutina",
                principalTable: "Rutinas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones");

            migrationBuilder.AlterColumn<int>(
                name: "rutinaID",
                table: "Cancelaciones",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Rutina",
                table: "Cancelaciones",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cancelaciones_Rutinas_Rutina",
                table: "Cancelaciones",
                column: "Rutina",
                principalTable: "Rutinas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
