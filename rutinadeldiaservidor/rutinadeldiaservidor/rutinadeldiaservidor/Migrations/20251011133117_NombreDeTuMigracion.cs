using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class NombreDeTuMigracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas");

            migrationBuilder.AlterColumn<int>(
                name: "CategoriaId",
                table: "Rutinas",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas");

            migrationBuilder.AlterColumn<int>(
                name: "CategoriaId",
                table: "Rutinas",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
