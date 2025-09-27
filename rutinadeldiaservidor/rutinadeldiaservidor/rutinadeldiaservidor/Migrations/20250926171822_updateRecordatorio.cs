using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class updateRecordatorio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Recordatorios_RutinaId",
                table: "Recordatorios");

            migrationBuilder.CreateIndex(
                name: "IX_Recordatorios_RutinaId",
                table: "Recordatorios",
                column: "RutinaId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Recordatorios_RutinaId",
                table: "Recordatorios");

            migrationBuilder.CreateIndex(
                name: "IX_Recordatorios_RutinaId",
                table: "Recordatorios",
                column: "RutinaId");
        }
    }
}
