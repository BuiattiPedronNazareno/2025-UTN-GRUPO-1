using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace rutinadeldiaservidor.Migrations
{
    /// <inheritdoc />
    public partial class AddTutorialFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasSeenAdultTutorial",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasSeenInfantTutorial",
                table: "Infantes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasSeenAdultTutorial",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "HasSeenInfantTutorial",
                table: "Infantes");
        }
    }
}
