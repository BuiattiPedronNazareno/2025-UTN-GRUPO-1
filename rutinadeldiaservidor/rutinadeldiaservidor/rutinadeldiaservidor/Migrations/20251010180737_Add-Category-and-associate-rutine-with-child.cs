using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryandassociaterutinewithchild : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Descripcion = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Id);
                });

            migrationBuilder.InsertData(
        table: "Categorias",
        columns: new[] { "Descripcion" },
        values: new object[] { "Sin categoría" }
    );

            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "Rutinas",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InfanteId",
                table: "Rutinas",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rutinas_CategoriaId",
                table: "Rutinas",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Rutinas_InfanteId",
                table: "Rutinas",
                column: "InfanteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull); // SetNull porque es opcional

            migrationBuilder.AddForeignKey(
                name: "FK_Rutinas_Infantes_InfanteId",
                table: "Rutinas",
                column: "InfanteId",
                principalTable: "Infantes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rutinas_Categorias_CategoriaId",
                table: "Rutinas");

            migrationBuilder.DropForeignKey(
                name: "FK_Rutinas_Infantes_InfanteId",
                table: "Rutinas");

            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Rutinas_CategoriaId",
                table: "Rutinas");

            migrationBuilder.DropIndex(
                name: "IX_Rutinas_InfanteId",
                table: "Rutinas");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Rutinas");

            migrationBuilder.DropColumn(
                name: "InfanteId",
                table: "Rutinas");
        }
    }
}
