using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BW_API.Migrations
{
    /// <inheritdoc />
    public partial class AddWheelsDBSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wheel_AspNetUsers_UserId",
                table: "Wheel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Wheel",
                table: "Wheel");

            migrationBuilder.RenameTable(
                name: "Wheel",
                newName: "Wheels");

            migrationBuilder.RenameIndex(
                name: "IX_Wheel_UserId",
                table: "Wheels",
                newName: "IX_Wheels_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Wheels",
                table: "Wheels",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wheels_AspNetUsers_UserId",
                table: "Wheels",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wheels_AspNetUsers_UserId",
                table: "Wheels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Wheels",
                table: "Wheels");

            migrationBuilder.RenameTable(
                name: "Wheels",
                newName: "Wheel");

            migrationBuilder.RenameIndex(
                name: "IX_Wheels_UserId",
                table: "Wheel",
                newName: "IX_Wheel_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Wheel",
                table: "Wheel",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wheel_AspNetUsers_UserId",
                table: "Wheel",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
